import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dropdown from '@/components/groupVote/dropdown';
import Card from '@/components/groupVote/card';
import * as db from '@/database';
import styles from '@/styles/GroupDetails.module.css';
import Link from 'next/link';
import 'react-datepicker/dist/react-datepicker.css';


const GroupDetailsPage = ({ user }) => {
  const router = useRouter();
  const { groupId } = router.query;
  const [groupDetails, setGroupDetails] = useState(null);
  const [places, setPlaces] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    if (!groupId || !user) return;

    const fetchInitialData = async () => {
      try {
        const details = await db.getGroup(groupId);
        const userPlaces = await db.getUserPlaces(user.uid);
        const groupProposals = await db.fetchProposalsByGroup(groupId);
        const userVotes = await db.fetchUserVotesByGroup(groupId, user.uid);

        setGroupDetails(details);
        setPlaces(userPlaces);
        setProposals(groupProposals);
        setUserVotes(userVotes);

        if (userPlaces.length > 0) {
          setSelectedPlace(userPlaces[0].id); // Set the initial selected place
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [groupId, user]);


  const handlePropose = async ({ place, date }) => {
    console.log("Attempting to propose", { place, date });

    const proposalData = {
      groupId,
      userId: user.uid,
      placeId: place.value,
      // imageUrl: place.imageUrl, 
      yelpUrl: place.yelpUrl,
      name: place.label,
      date: date ? date.toLocaleDateString() : undefined,
      time: date ? date.toLocaleTimeString() : undefined,
      timestamp: new Date()
    };

    try {
      const proposalId = await db.addProposal(proposalData);
      console.log("Proposal added with ID:", proposalId);
      // setProposals(prevProposals => [...prevProposals, { ...proposalData, id: proposalId }]);
      setProposals(prevProposals => {
        const newProposals = [...prevProposals, { ...proposalData, id: proposalId }];
        console.log("New proposals state:", newProposals); // Check the new state array
        return newProposals;
      });
    } catch (error) {
      console.error('Error adding proposal:', error);
    }
  };

  const handleDeleteProposal = async (proposalId) => {
    try {
      await db.deleteProposal(proposalId);
      setProposals(prevProposals => prevProposals.filter(proposal => proposal.id !== proposalId));
    } catch (error) {
      console.error('Error deleting proposal:', error);
    }
  };


  const handleVoteToggle = async (proposalId) => {
    try {
      const result = await db.toggleVote(groupId, proposalId, user.uid);

      // Update both userVotes and proposals
      setUserVotes(prevVotes => ({
        ...prevVotes,
        [proposalId]: result === "vote added" ? true : false  // Toggle hasVoted state
      }));

      setProposals(prevProposals => prevProposals.map(proposal => {
        if (proposal.id === proposalId) {
          const votesChange = result === "vote added" ? 1 : -1;  // Determine whether to increment or decrement
          return { ...proposal, votes: (proposal.votes || 0) + votesChange };  // Update vote count
        }
        return proposal;
      }));

      alert(result);
    } catch (error) {
      console.error('Error toggling vote:', error);
    }
  };


  return (
    <div style={{ marginLeft: '200px', marginRight: '200px' }}>
      <div className={styles.divWrapper + " is-flex is-flex-direction-column is-align-items-center"}>
        <div className="title has-text-centered">
          Welcome Group: {groupDetails ? groupDetails.groupName : "Loading"}
        </div>
        <div className="mt-3">
          <Link href="/group">
            <button className="button is-info is-small">Back to Group List</button>
          </Link>
        </div>
      </div>

      <div className='container' style={{ margin: '20px' }}>
        <div className="columns">
          <div className="column is-7">
            {places.length ? (
              <Dropdown
                options={places.map(place => ({
                  value: place.id,
                  label: place.name,
                  yelpUrl: place.yelpUrl
                }))}
                onPropose={handlePropose}
              />
            ) : (
              <p className="notification is-primary">
                No places available. Please add some places at your Private Space first
              </p>
            )}
          </div>

          {/* <div className={styles.borderleft + " column is-4"}> */}
          <div className="column">

            {proposals.map((proposal, index) => (
              <Card
                key={proposal.id}
                index={index}
                // imageUrl={proposal.imageUrl}
                userId={proposal.userId}
                currentUser={user.uid}
                yelpUrl={proposal.yelpUrl}
                placeName={proposal.name}
                date={proposal.date}
                time={proposal.time}
              // votes={proposal.votes} // Ensure that your proposal object has a votes field
              // onVote={() => handleVoteToggle(proposal.id)}
              onDelete={() => handleDeleteProposal(proposal.id)}
              // hasVoted={!!userVotes[proposal.id]}
              />
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;

