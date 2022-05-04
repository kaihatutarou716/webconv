package com.app_pke.webconv.common;

import com.app_pke.webconv.sql.SQL_GetUpdateInfo;
import org.json.JSONObject;

public class CommonData {

    private SQL_GetUpdateInfo sqlGetUpdateInfo;
    private JSONObject jsonObjs;

    public CommonData(SQL_GetUpdateInfo sqlGetUpdateInfo,JSONObject jsonObjs) {
        this.sqlGetUpdateInfo = sqlGetUpdateInfo;
        this.jsonObjs = jsonObjs;
    }

    public SQL_GetUpdateInfo getSqlGetUpdateInfo() {
        return this.sqlGetUpdateInfo;
    }

    public JSONObject getJsonObjs() {
        return this.jsonObjs;
    }

}
