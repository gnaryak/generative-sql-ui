'use client';

import { useState } from "react";
import axios from 'axios';

function Query({ query }: { query: string }) {
  return (
  <label>Query
      <br />
      <textarea id="query" readOnly rows={5} cols={50} value={query} />
    </label>
  )
}

function QueryResponse({ queryResponse }: { queryResponse: string }) {
  return (
    <label>Response
      <br />
      <textarea id="query-response" readOnly rows={10} cols={50} value={queryResponse} />
    </label>
  )
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [queryResponse, setQueryResponse] = useState('');
  const [query, setQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handlePrompt({target}: {target: HTMLInputElement}): void {
    setPrompt(target.value);
  }

  async function handleClick(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    console.log(prompt);
    setSubmitting(true);
    setQuery('Loading...');
    setQueryResponse('Loading...');
    try {
      const { data, status } = await axios.post('http://localhost:8000/gen-sql',
        { prompt },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }
        });
      setQuery(data.query);
      setQueryResponse(JSON.stringify(data.queryResponse, null, 2));
    } catch(err: any) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setQuery(`Error: ${err.message}`);
        setQueryResponse(JSON.stringify(err.response?.data, null, 2));
      } else {
        setQuery(`Error: ${err.message || err.status || 'Request Failed'}`);
        setQueryResponse(JSON.stringify(err, null, 2));
      }
    } finally {
      setSubmitting(false);
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold">Generative SQL</h1>
      <form onSubmit={handleClick} className="flex flex-col items-center">
        <label>What do you want to ask your database?
          <br />
          <input type="text" size={50} value={prompt} onChange={handlePrompt} />
        </label>
        <button type="submit" disabled={submitting}>Query Database</button>
        <br />
        <Query query={query} />
        <QueryResponse queryResponse={queryResponse} />
      </form>
    </main>
  )
}
