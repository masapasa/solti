import { ChatGPTAPI } from "chatgpt";
import { Configuration, OpenAIApi } from "openai";
import { oraPromise } from "ora";
import { FC, useEffect, useState } from "react";

export const GenerateView: FC = async ({}) => {
  const [text, setText] = useState("");
  const [summarizedtext, setsummarizedtext] = useState("");
  const [loading, setLoading] = useState(false);

  // const openai = new ChatGPTAPI({
  //   apiKey: process.env.OPENAI_API_KEY,
  //   debug: false,
  // });
  useEffect(() => {
    async function HandleSubmit() {
      const res = await oraPromise(api.sendMessage(prompt), {
        text: prompt
      });
    }
  }, []);

  return (
    <div className="App_">
      <div className="header">
        <h1 className="header_text">
          Text <span className="text_active">Summarizer</span>
        </h1>
        <h2 className="header_summary">
          {" "}
          Summarise your text into a shorter length.
        </h2>
      </div>
      <div className="container">
        <div className="text_form">
          <form>
            <label>Enter your text</label>
            <textarea
              rows={14}
              cols={80}
              placeholder="Put your text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </form>
        </div>
        <div>
          <button type="button" onClick={HandleSubmit}>
            {loading ? "loading..." : "Summarize"}
          </button>
        </div>
        <div className="summarized_text">
          <label>Summarized text</label>
          <textarea
            placeholder="Summarized text"
            cols={80}
            rows={14}
            value={summarizedtext}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
