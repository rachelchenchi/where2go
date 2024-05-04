import React from 'react';


const Card = ({ member, onVote, onDelete, votes, imageUrl, yelpUrl, placeName, hasVoted }) => {
  return (
    <div className="card">
      <div className="card-image">
        <figure className="image">
          <img src={imageUrl} alt={placeName} />
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <p className="title is-4">{placeName}</p>
          </div>
        </div>

        <div className="content">
          <a href={yelpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button is-small is-link is-outlined">
            Check on Yelp
          </a>
          <p>
            Note: Let's go to here on xxx at xxx
          </p>
        </div>
      </div>
      <footer className="card-footer">
        {/* <button className="card-footer-item button is-primary" onClick={onVote}>Vote</button> */}

        <button className={`card-footer-item button ${hasVoted ? 'is-info' : 'is-primary'}`}
          onClick={onVote}>
          {hasVoted ? 'Unvote' : 'Vote'}
        </button>

        <p className="card-footer-item">Votes: {votes}</p>
        <button onClick={onDelete} className="button is-danger">Delete</button>

      </footer>
    </div>
  );
};

export default Card;
