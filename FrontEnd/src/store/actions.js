import axios from "axios";

async function fetchQuestions() {
  try {
    const questions = await axios.get("http://localhost:3650/questions");
    return questions.data;
  } catch (error) {
    console.log("error >>", error);
  }
}

export default { fetchQuestions };
