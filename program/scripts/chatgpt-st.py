import os
import requests
import streamlit as st
from decouple import config
import openai
from IPython.display import display
from PIL import Image
image_dir_name = "images"
image_dir = os.path.join(os.curdir, image_dir_name)
response = False
prompt_tokens = 0
completion_tokes = 0
total_tokens_used = 0
cost_of_response = 0

API_KEY =config('OPENAI_API_KEY')
openai.api_key = API_KEY


# def make_request(question_input: str):
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {"role": "system", "content": f"{question_input}"},
#         ]
#     )
#     return response


# st.header("Streamlit + OpenAI ChatGPT API")

# st.markdown("""---""")

# question_input = st.text_input("Enter question")
# rerun_button = st.button("Rerun")

# st.markdown("""---""")

# if question_input:
#     response = make_request(question_input)
# else:
#     pass

# if rerun_button:
#     response = make_request(question_input)
# else:
#     pass

# if response:
#     st.write("Response:")
#     st.write(response["choices"][0]["message"]["content"])

#     prompt_tokens = response["usage"]["prompt_tokens"]
#     completion_tokes = response["usage"]["completion_tokens"]
#     total_tokens_used = response["usage"]["total_tokens"]

#     cost_of_response = total_tokens_used * 0.000002
#     if st.button("Summarize"):
#         prompt = response
#         def make_summary(prompt: str):
#             response_summary = openai.ChatCompletion.create(
#                 model="gpt-3.5-turbo",
#                 messages=[
#                     {"role": "system", "content": f"Summarize this {prompt} in one sentence."},
#                 ]
#             )
#             return response_summary
#         answer = make_summary(prompt)["choices"][0]["message"]["content"]
#         st.write(answer)
answer = st.text_input("Enter your prompt", value = "90s comic graphic art of a person riding skateboards in the city with proper looking faces black and white skateboard with wheels")
generate_nft = st.button("Generate NFT")
if generate_nft:
    generation_response = openai.Image.create(
    prompt=answer,
    n=1,
    size="512x512",
    response_format="url",
)
    generated_image_name = "tech.png"  # any name you like; the filetype should be .png
    generated_image_filepath = os.path.join(image_dir, generated_image_name)
    generated_image_url = generation_response["data"][0]["url"]  # extract image URL from response
    generated_image = requests.get(generated_image_url).content  # download the image

    with open(generated_image_filepath, "wb") as image_file:
        image_file.write(generated_image)  # write the image to the file
        # print the image
    print(generated_image_filepath)
    display(Image.open(generated_image_filepath))
    st.image(generated_image)

with st.sidebar:
    st.title("Usage Stats:")
    st.markdown("""---""")
    st.write("Promt tokens used :", prompt_tokens)
    st.write("Completion tokens used :", completion_tokes)
    st.write("Total tokens used :", total_tokens_used)
    st.write("Total cost of request: ${:.8f}".format(cost_of_response))