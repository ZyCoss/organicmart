package com.web.processor;

import com.web.config.Environment;
import com.web.constants.Language;
import com.web.models.*;
import com.web.constants.Parameter;
import com.web.constants.MoMoException;
import com.web.constants.Encoder;
import com.web.constants.LogUtils;
import com.web.models.CbTokenInquiryRequest;
import com.web.models.CbTokenInquiryResponse;
import com.web.models.HttpResponse;

public class InquiryCbToken extends AbstractProcess<CbTokenInquiryRequest, CbTokenInquiryResponse> {
    public InquiryCbToken(Environment environment) {
        super(environment);
    }

    public static CbTokenInquiryResponse process(Environment env, String orderId, String requestId, String partnerClientId) throws Exception {
        try {
            InquiryCbToken m2Processor = new InquiryCbToken(env);

            CbTokenInquiryRequest request = m2Processor.createInquiryTokenRequest(orderId, requestId, partnerClientId);
            CbTokenInquiryResponse cbTokenInquiryResponse = m2Processor.execute(request);

            return cbTokenInquiryResponse;
        } catch (Exception exception) {
            LogUtils.error("[TokenInquiryProcess] "+ exception);
        }
        return null;
    }

    @Override
    public CbTokenInquiryResponse execute(CbTokenInquiryRequest request) throws MoMoException {
        try {

            String payload = getGson().toJson(request, CbTokenInquiryRequest.class);

            HttpResponse response = execute.sendToMoMo(environment.getMomoEndpoint().getCbTokenInquiryUrl(), payload);

            if (response.getStatus() != 200) {
                throw new MoMoException("[CbTokenInquiryResponse] [" + request.getOrderId() + "] -> Error API");
            }

            System.out.println("uweryei7rye8wyreow8: "+ response.getData());

            CbTokenInquiryResponse cbTokenInquiryResponse = getGson().fromJson(response.getData(), CbTokenInquiryResponse.class);
            String responserawData = Parameter.REQUEST_ID + "=" + cbTokenInquiryResponse.getRequestId() +
                    "&" + Parameter.ORDER_ID + "=" + cbTokenInquiryResponse.getOrderId() +
                    "&" + Parameter.MESSAGE + "=" + cbTokenInquiryResponse.getMessage() +
                    "&" + Parameter.RESULT_CODE + "=" + cbTokenInquiryResponse.getResultCode();

            LogUtils.info("[CbTokenInquiryResponse] rawData: " + responserawData);

            return cbTokenInquiryResponse;

        } catch (Exception exception) {
            LogUtils.error("[CbTokenInquiryResponse] "+ exception);
            throw new IllegalArgumentException("Invalid params capture MoMo Request");
        }
    }

    public CbTokenInquiryRequest createInquiryTokenRequest(String orderId, String requestId, String partnerClientId) {
        try {
            String requestRawData = new StringBuilder()
                    .append(Parameter.ACCESS_KEY).append("=").append(partnerInfo.getAccessKey()).append("&")
                    .append(Parameter.ORDER_ID).append("=").append(orderId).append("&")
                    .append(Parameter.PARTNER_CLIENT_ID).append("=").append(partnerClientId).append("&")
                    .append(Parameter.PARTNER_CODE).append("=").append(partnerInfo.getPartnerCode()).append("&")
                    .append(Parameter.REQUEST_ID).append("=").append(requestId)
                    .toString();

            String signRequest = Encoder.signHmacSHA256(requestRawData, partnerInfo.getSecretKey());
            LogUtils.debug("[TokenInquiryRequest] rawData: " + requestRawData + ", [Signature] -> " + signRequest);

            return new CbTokenInquiryRequest(partnerInfo.getPartnerCode(), orderId, requestId, Language.EN, partnerClientId, signRequest);
        } catch (Exception e) {
            LogUtils.error("[TokenInquiryResponse] "+ e);
        }

        return null;
    }
}
