# Telephony Central Flow using AI

This project aims to create an intelligent flow for telephony centrals by leveraging AI technologies. The system is designed to recognize speech using OpenAI Whisper, generate responses using GPT (Generative Pre-trained Transformer), and then process the generated response further using ElevenLabs Voice AI.

## Introduction

In today's digital world, telephony centrals play a crucial role in handling a large volume of phone calls and providing customer support. However, traditional telephony systems often lack the intelligence and personalization required to deliver a seamless and efficient user experience.

To address these limitations, we have developed a cutting-edge telephony central flow using the power of AI. By combining advanced speech recognition, natural language generation, and voice processing technologies, we aim to revolutionize the way telephony centrals interact with callers.

## Features

1. **Speech Recognition using OpenAI Whisper:** OpenAI Whisper is a state-of-the-art automatic speech recognition (ASR) system capable of converting spoken language into text with high accuracy. By integrating Whisper into our telephony central flow, we can effectively transcribe incoming calls, making it easier to process and analyze the user's input.

2. **Response Generation using GPT (Generative Pre-trained Transformer):** GPT is a powerful language model that has been pre-trained on a vast corpus of text data. It can generate human-like responses based on given input text. In our project, GPT acts as the core component responsible for generating appropriate and contextually relevant responses to the caller's queries or requests.

3. **Voice AI Processing with ElevenLabs Voice AI:** ElevenLabs Voice AI is an advanced voice processing system that takes the generated text response from GPT and transforms it into natural, human-like speech. This step ensures that the responses delivered to the callers are not only accurate but also sound natural and engaging, enhancing the overall user experience.

## Integration with Asterisk and Call Flow

For the purposes of the hackathon, we integrated this AI-powered telephony flow with the Asterisk telephony system. Asterisk is a powerful open-source framework for building communication applications. Our service receives a WAV file containing the caller's audio, which is processed using OpenAI Whisper for speech recognition.

The call flow with Asterisk is as follows:

1. An incoming call is received by the Asterisk telephony system.
2. The caller's audio is recorded and saved as a WAV file.
3. The WAV file is passed to our AI service for speech recognition using OpenAI Whisper.
4. The transcribed text is then sent to GPT for generating a contextually relevant response.
5. The GPT response is transformed into natural speech using ElevenLabs Voice AI.
6. The synthesized WAV file containing the AI-generated response is returned to the Asterisk system.
7. Asterisk plays the AI-generated response to the caller over the phone.

## Real-World Applications

The potential applications of this AI-powered telephony central flow are vast. By using a language processing solution such as GPT or CODEX, the system can generate machine-understandable languages such as SQL to query a database or a REST API. This opens up opportunities to automate complex tasks and provide dynamic and real-time responses to callers.

The service's capabilities enable call centers to reduce their clients' waiting time by providing instant and accurate responses to queries. Moreover, the enhanced usability of the telephony system can significantly improve the caller's experience.

Additionally, the system's ability to process and analyze large volumes of call data with increased efficiency and accuracy makes it a valuable tool for call centers to track important data and gain valuable insights.