import React from 'react';


const Card = ({
  index, proposalId, userId, currentUser, totalMembers,
  onVote, onDelete, votes, imageUrl, date,
  time, yelpUrl, placeName, hasVoted }) => {

  const handleVoteClick = () => {
    onVote(proposalId, hasVoted);
  };

  return (
    <div className="card">
      <head class="card-header">
        <p class="card-header-title">Proposal {index + 1}</p>
      </head>

      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <p className="title is-3">{placeName}</p>
          </div>
        </div>
        
        <div className="content">
          <a href={yelpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button is-small is-link is-outlined">
            Check on Yelp
          </a>
          <p style={{ margin: '10px' }}>
            Note: Let's go here on {date} at {time} ET.
          </p>
        </div>

        <footer className="card-footer">
          <button className={`card-footer-item button ${hasVoted ? 'is-info' : 'is-primary'}`}
            onClick={handleVoteClick}>
            {hasVoted ? 'Unvote' : 'Vote'}
          </button>
          <p className="card-footer-item">Votes: {votes} / {totalMembers}</p>
          {userId === currentUser && (
            <button onClick={() => onDelete(proposalId)} className="button is-danger">Delete</button>
          )}
        </footer>

      </div>
    </div>
  );
};

export default Card;
