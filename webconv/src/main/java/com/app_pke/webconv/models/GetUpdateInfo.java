package com.app_pke.webconv.models;

import com.app_pke.webconv.common.CommonData;
import com.app_pke.webconv.mapper.ChangeLogs;
import com.app_pke.webconv.sql.SQL_GetUpdateInfo;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

public class GetUpdateInfo {

    @Autowired
    private SQL_GetUpdateInfo sqlObj;
    private JSONObject jsonObjs;
    private String errMsg = "";

    public String main(CommonData argService) {

        List<ChangeLogs> changeLogList = null;
        String json = "";

        try {

            sqlObj = argService.getSqlGetUpdateInfo();
            jsonObjs = argService.getJsonObjs();
            int curpage = Integer.parseInt(jsonObjs.getString("curPage"));
            int disNum = Integer.parseInt(jsonObjs.getString("disNum"));

            // 全件数
            int disCount = sqlObj.changeLogsCount();

            if (disCount != 0) {

                // 表示データ
                changeLogList = sqlObj.getTenChangeLogs(curpage * disNum);

                ObjectMapper mapper = new ObjectMapper();
                ArrayList arrJson = new ArrayList();

                for (int i = 0; i < changeLogList.size(); i++) {

                    ChangeLogs cLogs = new ChangeLogs();
                    cLogs.id = changeLogList.get(i).id;
                    cLogs.version = changeLogList.get(i).version;
                    cLogs.updatedate = changeLogList.get(i).updatedate;
                    cLogs.updateconts = changeLogList.get(i).updateconts;
                    arrJson.add(mapper.writeValueAsString(cLogs));
                }
                json = new JSONArray(arrJson).toString();
            }

        } catch (Exception e) {
            setErrMsg(e.toString());
        }
        return json;
    }

    public void setErrMsg(String msg) {
        this.errMsg = msg;
    }

    public String getErrMsg() {
        return this.errMsg;
    }
}
