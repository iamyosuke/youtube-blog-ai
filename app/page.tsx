import { YoutubeTranscript } from 'youtube-transcript';

export default async function Home() {

  const transcript = await YoutubeTranscript.fetchTranscript(
    'https://www.youtube.com/watch?v=4oNLQUznT8A',
  );
  return (
    <div>
      <pre>{JSON.stringify(transcript, null, 2)}</pre>
    </div>
  );
}
