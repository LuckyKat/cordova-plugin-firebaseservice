package com.rener.firebase;

import android.app.Activity;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Rener on 5/27/2016.
 */

public class Notification extends CordovaPlugin {

  private final String TAG = "FBNotification";

  private Activity mActivity;
  public static final String JS_CALLBACK_KEY = "JS_CALLBACK";
  public static final String LAST_PUSH_KEY = "LAST_PUSH";

  public static final String REG_COMPLETE_BROADCAST_KEY = "REGISTRATION_COMPLETE";
  public static final String MSG_RECEIVED_BROADCAST_KEY = "MESSAGE_RECEIVED";

  private String jsCallback;

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
  }

  @Override
  public boolean execute(String action, final JSONArray args, CallbackContext callbackContext) throws JSONException {

    if ("register".equals(action)) {
      jsCallback = args.getJSONObject(0).getString("jsCallback");
      if (jsCallback == null || jsCallback.equalsIgnoreCase("")) {
        callbackContext.error("Please provide a jsCallback to fully support notifications");
        return false;
      }
    }
    callbackContext.error("Action not Recognized.");

    return false;
  }

  public void sendPushToJavascript(String data) {
    Log.d(TAG, "sendPushToJavascript: " + data);

    if (data != null) {
      //We remove the last saved push since we're sending one.
      SharedPreferences sharedPreferences =
        PreferenceManager.getDefaultSharedPreferences(mActivity);
      sharedPreferences.edit().remove(LAST_PUSH_KEY).apply();

      final String js = "javascript:"+jsCallback+"(" + JSONObject.quote(data).toString() + ")";
      webView.getEngine().loadUrl(js, false);
    }
  }
}
