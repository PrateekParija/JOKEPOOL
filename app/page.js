'use client'

import { useState, useRef, useEffect } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

export default function App() {
  const [view, setView] = useState('home'); // State to toggle between home and chat views

  // Chat-related states
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm here for you. How can I help today?" },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: data.content },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }

    setMessage('');
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Render homepage
  if (view === 'home') {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="url('/funny-background.jpg')"
        backgroundSize="cover"
        textAlign="center"
      >
        <Typography variant="h3" color="white" mb={4}>
          Welcome to Jokepool!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setView('chat')}
        >
          Let's Chat Buddy
        </Button>
      </Box>
    );
  }

  // Render chat interface
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="yellow"
    >
      <Stack
        direction="column"
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
        bgcolor="white"
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={msg.role === 'assistant' ? 'lightgrey' : 'lightblue'}
                color="black"
                borderRadius={20}
                p={2}
                sx={{ border: '1px solid grey', maxWidth: '60%', textAlign: 'left', fontStyle: 'italic' }}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button variant="contained" onClick={sendMessage} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setView('home')}
        sx={{ position: 'absolute', bottom: 16 }}
      >
        Back to Home
      </Button>
    </Box>
  );
}
