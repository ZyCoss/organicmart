package com.web.processor;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.web.config.Environment;
import com.web.config.PartnerInfo;
import com.web.constants.MoMoException;
import com.web.constants.Execute;

/**
 * @author hainguyen
 * Documention: https://developers.momo.vn
 */

public abstract class AbstractProcess<T, V> {

    protected PartnerInfo partnerInfo;
    protected Environment environment;
    protected Execute execute = new Execute();

    public AbstractProcess(Environment environment) {
        this.environment = environment;
        this.partnerInfo = environment.getPartnerInfo();
    }

    public static Gson getGson() {
        return new GsonBuilder()
                .disableHtmlEscaping()
                .create();
    }

    public abstract V execute(T request) throws MoMoException;
}
