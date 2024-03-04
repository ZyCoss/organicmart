package com.web.api;

import com.web.dto.LoginDto;
import com.web.dto.PasswordDto;
import com.web.dto.TokenDto;
import com.web.dto.CustomUserDetails;
import com.web.entity.Authority;
import com.web.entity.User;
import com.web.exception.MessageException;
import com.web.jwt.JwtTokenProvider;
import com.web.repository.AuthorityRepository;
import com.web.repository.UserRepository;
import com.web.utils.Contains;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserApi {

    private final UserRepository userRepository;

    private final JwtTokenProvider jwtTokenProvider;

    private final UserUtils userUtils;

    private final MailService mailService;

    @Autowired
    private AuthorityRepository authorityRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserApi(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, UserUtils userUtils, MailService mailService) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userUtils = userUtils;
        this.mailService = mailService;
    }

    /*token device get from firebase*/
    @PostMapping("/login")
    public TokenDto authenticate(@RequestBody LoginDto loginDto) throws Exception {
        Optional<User> users = userRepository.findByUsername(loginDto.getUsername());
        // check infor user
        checkUser(users);
        if(passwordEncoder.matches(loginDto.getPassword(), users.get().getPassword())){
            CustomUserDetails customUserDetails = new CustomUserDetails(users.get());
            String token = jwtTokenProvider.generateToken(customUserDetails);
            TokenDto tokenDto = new TokenDto();
            tokenDto.setToken(token);
            tokenDto.setUser(users.get());
            return tokenDto;
        }
        else{
            throw new MessageException("Mật khẩu không chính xác", 400);
        }
    }

    @PostMapping("/regis")
    public ResponseEntity<?> regisUser(@RequestBody User user) throws URISyntaxException {
        userRepository.findByEmail(user.getEmail())
                .ifPresent(exist->{
                    if(exist.getActivation_key() != null){
                        throw new MessageException("Tài khoản chưa được kích hoạt", 330);
                    }
                    throw new MessageException("Email đã được sử dụng", 400);
                });
        user.setCreatedDate(new Date(System.currentTimeMillis()));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActived(false);
        user.setActivation_key(userUtils.randomKey());
        user.setUsername(user.getEmail());
        Authority authority = authorityRepository.findById(Contains.ROLE_USER).get();
        user.setAuthorities(authority);
        User result = userRepository.save(user);
        mailService.sendEmail(user.getEmail(), "Xác nhận tài khoản của bạn","Cảm ơn bạn đã tin tưởng và xử dụng dịch vụ của chúng tôi:<br>" +
                "Để kích hoạt tài khoản của bạn, hãy nhập mã xác nhận bên dưới để xác thực tài khoản của bạn<br><br>" +
                "<a style=\"background-color: #2f5fad; padding: 10px; color: #fff; font-size: 18px; font-weight: bold;\">"+user.getActivation_key()+"</a>",false, true);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/active-account")
    public ResponseEntity<?> activeAccount(@RequestParam String email, @RequestParam String key) throws URISyntaxException {
        Optional<User> user = userRepository.getUserByActivationKeyAndEmail(key, email);
        user.ifPresent(exist->{
            exist.setActivation_key(null);
            exist.setActived(true);
            userRepository.save(exist);
            return;
        });
        if(user.isEmpty()){
            throw new MessageException("Email hoặc mã xác nhận không chính xác", 404);
        }
        return new ResponseEntity<>("Kích hoạt thành công", HttpStatus.OK);
    }

    @PostMapping("/user/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordDto passwordDto){
        User user = userUtils.getUserWithAuthority();
        if(passwordEncoder.matches(passwordDto.getOldPass(), user.getPassword())){
            user.setPassword(passwordEncoder.encode(passwordDto.getNewPass()));
            userRepository.save(user);
        }
        else{
            throw new MessageException("Invalid password", 500);
        }
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> changePassword(@RequestParam String email){
        Optional<User> users = userRepository.findByEmail(email);
        // check infor user
        checkUser(users);
        String randomPass = userUtils.randomPass();
        users.get().setPassword(passwordEncoder.encode(randomPass));
        userRepository.save(users.get());
        mailService.sendEmail(email, "Quên mật khẩu","Cảm ơn bạn đã tin tưởng và xử dụng dịch vụ của chúng tôi:<br>" +
                "Chúng tôi đã tạo một mật khẩu mới từ yêu cầu của bạn<br>" +
                "Tuyệt đối không được chia sẻ mật khẩu này với bất kỳ ai. Bạn hãy thay đổi mật khẩu ngay sau khi đăng nhập<br><br>" +
                "<a style=\"background-color: #2f5fad; padding: 10px; color: #fff; font-size: 18px; font-weight: bold;\">"+randomPass+"</a>",false, true);

        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @GetMapping("/admin/get-user-by-role")
    public ResponseEntity<?> getUserByRole(@RequestParam(value = "role", required = false) String role){
        List<User> page = null;
        if(role == null){
            page = userRepository.findAll();
        }
        else{
            page = userRepository.getUserByRole(role);
        }
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @GetMapping("/admin/check-role-admin")
    public void checkRoleAdmin(){
        System.out.println("admin");
    }

    @GetMapping("/user/check-role-user")
    public void checkRoleUser(){
        System.out.println("user");
    }

    @PostMapping("/admin/lockOrUnlockUser")
    public void activeOrUnactiveUser(@RequestParam("id") Long id){
        User user = userRepository.findById(id).get();
        if(user.getActived() == true){
            user.setActived(false);
            userRepository.save(user);
            return;
        }
        else{
            user.setActived(true);
            userRepository.save(user);
        }
    }


    @PostMapping("/user/user-logged")
    public ResponseEntity<?> userLogged(){
        User user = userUtils.getUserWithAuthority();
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @PostMapping("/user/change-infor-user")
    public ResponseEntity<?> changeInforUser(@RequestParam String fullname, @RequestParam String phone, @RequestParam String address){
        User user = userUtils.getUserWithAuthority();
        user.setFullname(fullname);
        user.setPhone(phone);
        user.setAddress(address);
        userRepository.save(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    public Boolean checkUser(Optional<User> users){
        if(users.isPresent() == false){
            throw new MessageException("Không tìm thấy tài khoản", 404);
        }
        else if(users.get().getActivation_key() != null && users.get().getActived() == false){
            throw new MessageException("Tài khoản chưa được kích hoạt", 300);
        }
        else if(users.get().getActived() == false && users.get().getActivation_key() == null){
            throw new MessageException("Tài khoản đã bị khóa", 500);
        }
        return true;
    }
}
