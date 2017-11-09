package com.facebook.react.modules.network;

import com.facebook.react.bridge.ReactApplicationContext;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class NetworkingModuleUtils {
    public static NetworkingModule createNetworkingModuleWithCustomClient(ReactApplicationContext context) {
        OkHttpClient client = OkHttpClientProvider.createClient();

        OkHttpClient customClient = client.newBuilder()
                .addNetworkInterceptor(new Interceptor() {
                    @Override
                    public Response intercept(Chain chain) throws IOException {
                        Request request = chain.request();
                        String contentType = request.header("Content-Type");

                        // If the request header is `Content-Type: application/octet-stream; charset=utf-8`,
                        // change not to add `charset=utf-8`.
                        // okhttp adds `charset=utf-8` by default,
                        // and Dropbox API returns an error when `application/octet-stream` request contains `charset=utf-8`.
                        // See https://github.com/facebook/react-native/issues/8237#issuecomment-332746080
                        Request customRequest = "application/octet-stream; charset=utf-8".equals(contentType) ?
                                request.newBuilder()
                                        .header("content-type", "application/octet-stream")
                                        .build() : request;

                        return chain.proceed(customRequest);
                    }
                }).build();

        return new NetworkingModule(context, null, customClient);
    }
}
