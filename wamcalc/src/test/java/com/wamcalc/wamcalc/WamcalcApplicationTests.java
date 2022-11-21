package com.wamcalc.wamcalc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import com.wamcalc.wamcalc.data.SemesterRepository;
import com.wamcalc.wamcalc.data.StudentRepository;
import com.wamcalc.wamcalc.web.AuthController;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
@AutoConfigureMockMvc
public class WamcalcApplicationTests {

	@Autowired
	private AuthController authController;

	@Autowired
	private StudentRepository studentRepository;

	@Autowired
	private SemesterRepository semesterRepository;

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private WebApplicationContext webApplicationContext;

	@Before("")
	public void setUp() {
		this.mockMvc = webAppContextSetup(webApplicationContext).build();
	}

	@Test
	public void authControllerNotNull() {
		assertThat(authController).isNotNull();
	}

	@Test
	public void testAuthSignupInvalid() throws Exception {

		this.mockMvc.perform(post("/api/auth/signup")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"username\": \"asen567\", \"email\": \"aditya@gmail.com\", \"password\": \"Admin4656\" }")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is4xxClientError());
	}

	@Test
	public void testAuthSignupEmailInvalid() throws Exception {

		this.mockMvc.perform(post("/api/auth/signup")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"username\": \"asen567\", \"email\": \"NotEmail\", \"password\": \"Admin4656\" }")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is4xxClientError());
	}

	@Test
	public void testAuthLogin() throws Exception {

		this.mockMvc.perform(post("/api/auth/signin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"username\": \"asen567\", \"password\": \"Admin4656\" }")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	public void testAuthLoginInvalid() throws Exception {

		this.mockMvc.perform(post("/api/auth/signin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"username\": \"asen567\", \"password\": \"Wrong\" }")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is4xxClientError());
	}

	@Test
	public void testSemesterController() throws Exception {

		MvcResult result = this.mockMvc.perform(post("/api/auth/signin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"username\": \"asen567\", \"password\": \"Admin4656\" }")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk()).andReturn();

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result.getResponse().getContentAsString());
		String token = (String) json.get("accessToken");
		String auth = "Bearer " + token;

		MvcResult result2 = this.mockMvc.perform(post("/api/semester/{username}", "asen567")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"name\": \"2022 Semester 2\" }")
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated()).andReturn();

		JSONObject json2 = (JSONObject) parser.parse(result2.getResponse().getContentAsString());
		int id = (int) json2.get("id");

		this.mockMvc.perform(get("/api/semester/all/{username}", "asen567")
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		this.mockMvc.perform(get("/api/semester/{id}", id)
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		this.mockMvc.perform(put("/api/semester/{id}", id)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"current\": false }")
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	public void testUOSController() throws Exception {

		MvcResult result = this.mockMvc.perform(post("/api/auth/signin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"username\": \"asen567\", \"password\": \"Admin4656\" }")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk()).andReturn();

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result.getResponse().getContentAsString());
		String token = (String) json.get("accessToken");
		String auth = "Bearer " + token;

		MvcResult result2 = this.mockMvc.perform(post("/api/semester/{username}", "asen567")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"name\": \"2020 Semester 2\" }")
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated()).andReturn();

		JSONObject json2 = (JSONObject) parser.parse(result2.getResponse().getContentAsString());
		int sem_id = (int) json2.get("id");

		MvcResult result3 = this.mockMvc.perform(post("/api/uos/{sem_id}", sem_id)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"code\": \"ELEC5619\",  \"name\": \"Spring\", \"goal_mark\": \"100\"}")
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated()).andReturn();

		JSONObject json3 = (JSONObject) parser.parse(result3.getResponse().getContentAsString());
		int id = (int) json3.get("id");

		this.mockMvc.perform(get("/api/uos/all/{sem_id}", sem_id)
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		this.mockMvc.perform(get("/api/uos/{id}", id)
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		this.mockMvc.perform(put("/api/uos/{id}", id)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"on_track\": true, \"goal_mark\": \"85\"," +
								"\"overall_mark\": \"80\"," +
								"\"final_mark\": \"90\" }")
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	public void testAssessmentController() throws Exception {

		MvcResult result = this.mockMvc.perform(post("/api/auth/signin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"username\": \"asen567\", \"password\": \"Admin4656\" }")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk()).andReturn();

		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(result.getResponse().getContentAsString());
		String token = (String) json.get("accessToken");
		String auth = "Bearer " + token;

		MvcResult result2 = this.mockMvc.perform(post("/api/semester/{username}", "asen567")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"name\": \"2021 Semester 2\" }")
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated()).andReturn();

		JSONObject json2 = (JSONObject) parser.parse(result2.getResponse().getContentAsString());
		int sem_id = (int) json2.get("id");

		MvcResult result3 = this.mockMvc.perform(post("/api/uos/{sem_id}", sem_id)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"code\": \"PHIL1012\",  \"name\": \"Logic\", \"goal_mark\": \"100\"}")
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated()).andReturn();

		JSONObject json3 = (JSONObject) parser.parse(result3.getResponse().getContentAsString());
		int uos_id = (int) json3.get("id");

		MvcResult result4 = this.mockMvc.perform(post("/api/assessment/{uos_id}", uos_id)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"name\": \"Exam\", \"weight\": \"100\", \"mark\": \"60\"}")
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated()).andReturn();

		JSONObject json4 = (JSONObject) parser.parse(result4.getResponse().getContentAsString());
		int id = (int) json4.get("id");

		this.mockMvc.perform(get("/api/assessment/all/{uos_id}", uos_id)
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		this.mockMvc.perform(get("/api/assessment/{id}", id)
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		this.mockMvc.perform(put("/api/assessment/{id}", id)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{ \"name\": \"Exam\"," +
								"\"weight\": \"100\", \"mark\": \"95\"," +
								"\"isFinal\": true }")
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());

		this.mockMvc.perform(delete("/api/semester/{sem_id}", sem_id)
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", auth)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());

	}

}
