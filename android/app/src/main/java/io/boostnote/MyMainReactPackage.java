package io.boostnote;

import com.facebook.react.bridge.ModuleSpec;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.network.NetworkingModule;
import com.facebook.react.modules.network.NetworkingModuleUtils;
import com.facebook.react.shell.MainReactPackage;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Provider;

public class MyMainReactPackage extends MainReactPackage {
    @Override
    public List<ModuleSpec> getNativeModules(ReactApplicationContext context) {
        List<ModuleSpec> nativeModules = super.getNativeModules(context);
        return adjustModules(context, nativeModules);
    }

    private List<ModuleSpec> adjustModules(ReactApplicationContext context, List<ModuleSpec> moduleSpecs) {
        ArrayList<ModuleSpec> modules = new ArrayList<>(moduleSpecs);

        for (int i = 0; i < modules.size(); i++) {
            ModuleSpec spec = modules.get(i);
            if (spec.getType().equals(NetworkingModule.class)) {
                modules.set(i, getCustomNetworkingModule(context));
                break;
            }
        }

        return modules;
    }

    private ModuleSpec getCustomNetworkingModule(final ReactApplicationContext context) {
        return new ModuleSpec(NetworkingModule.class, new Provider<NativeModule>() {
            @Override
            public NativeModule get() {
                return NetworkingModuleUtils.createNetworkingModuleWithCustomClient(context);
            }
        });
    }
}
