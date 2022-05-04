package com.app_pke.webconv.controller;

import javax.servlet.http.HttpServletResponse;
import com.app_pke.webconv.common.CommonData;
import com.app_pke.webconv.models.GetUpdateInfo;
import com.app_pke.webconv.sql.SQL_GetUpdateInfo;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class WebConvController {

	@Autowired
	private SQL_GetUpdateInfo sqlGetUpdateInfo;

	// ------------------------ページ遷移------------------------

	@GetMapping("/")
	@RequestMapping("/")
	public String index() {
		return "Home";
	}

	@GetMapping("Home")
	@RequestMapping("Home")
	public String Home() {
		return "Home";
	}

	@GetMapping("DmlCreate")
	@RequestMapping("DmlCreate")
	public String DmlCreate() {
		return "DmlCreate";
	}

	@GetMapping("JsonFmt")
	@RequestMapping("JsonFmt")
	public String JsonFmt() {
		return "JsonFmt";
	}

	@GetMapping("Todo")
	@RequestMapping("Todo")
	public String Todo() {
		return "Todo";
	}

	@GetMapping("EasyTimer")
	@RequestMapping("EasyTimer")
	public String EasyTimer() {
		return "EasyTimer";
	}

	@GetMapping("ImgMcTool")
	@RequestMapping("ImgMcTool")
	public String ImgMcTool() {
		return "ImgMcTool";
	}

	// ------------------------その他------------------------

	// 更新履歴取得
	@RequestMapping("updateInfo")
	@PostMapping("updateInfo")
	public ModelAndView getUpdateInfo_mov(HttpServletResponse response, @RequestBody String param, ModelAndView mav) {

		try {

			JSONObject jsonObjs = jsonConv(param);
			GetUpdateInfo info = new GetUpdateInfo();
			CommonData cd = new CommonData(sqlGetUpdateInfo,jsonObjs);
			String arrList = info.main(cd);

			if (info.getErrMsg().isEmpty() || info.getErrMsg() == null) {
				mav.setViewName("Home");
				mav.addObject("histyData", arrList);
				mav.addObject("errMsg", "");
			} else {
				mav.setViewName("Home");
				mav.addObject("histyData", "");
				mav.addObject("errMsg", info.getErrMsg());
			}

		} catch (Exception e) {
			System.out.println(e);
		}
		return mav;
	}

	@GetMapping("MarlUsed")
	@RequestMapping("MarlUsed")
	public String MarlUsed() {
		return "MarlUsed";
	}

	// ------------------------共通処理------------------------

	public JSONObject jsonConv(String options) {

		String sltOpn = options.replace("[", "").replace("]", "");
		JSONObject ob = new JSONObject(sltOpn);
		return ob;
	}

}