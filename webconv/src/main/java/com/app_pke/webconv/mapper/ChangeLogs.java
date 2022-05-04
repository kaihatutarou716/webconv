package com.app_pke.webconv.mapper;
import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class ChangeLogs implements Serializable{

    @Id
    @GeneratedValue
    public int id;
    public String version;
    public String updatedate;
    public String updateconts;

    public int getId() {
        return id;
    }

    public String getVersion() {
        return version;
    }

    public String getUpdateDate() {
        return updatedate;
    }

    public String getUpdateconts() {
        return updateconts;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setVersion(String version) {
        this.version =  version;
    }

    public void setUpdateDate(String updateDate) {
        this.updatedate = updateDate;
    }

    public void setUpdateconts(String updateConts) {
        this.updateconts = updateConts;
    }
}
