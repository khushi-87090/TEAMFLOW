import { useParams, Link } from 'react-router-dom';

export default function Workspace() {
  // Grab the team ID from the URL
  const { id } = useParams();

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">&larr; Back to Dashboard</Link>
      <h2>Team Workspace</h2>
      <p>You are inside team ID: {id}</p>
      <hr />
      <h3>Tasks will go here...</h3>
    </div>
  );
}