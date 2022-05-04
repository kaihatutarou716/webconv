package com.app_pke.webconv.sql;
import java.util.List;
import org.springframework.jdbc.core.RowMapper;
import com.app_pke.webconv.mapper.ChangeLogs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class SQL_GetUpdateInfo {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public  List<ChangeLogs>  getTenChangeLogs(int limitNum)  throws DataAccessException {
        StringBuilder query = new StringBuilder();
        query.append(" SELECT");
        query.append("  id,");
        query.append("  version,");
        query.append("  updatedate,");
        query.append("  updateconts");
        query.append(" FROM");
        query.append(" changelogs");
        query.append(" ORDER BY");
        query.append(" id DESC OFFSET 0");
        query.append(" LIMIT ?");

        RowMapper<ChangeLogs> rowMapper = new BeanPropertyRowMapper<ChangeLogs>(ChangeLogs.class);
        List<ChangeLogs> logList = jdbcTemplate.query(query.toString(), rowMapper,limitNum);

        return logList;
    }

    public int changeLogsCount() throws DataAccessException{
        String query = "SELECT COUNT(*) FROM changelogs";
        int count = jdbcTemplate.queryForObject(query, Integer.class);
        return count;
    }
}