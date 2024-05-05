import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dropdown from '@/components/groupVote/dropdown';
import Card from '@/components/groupVote/card';
import * as db from '@/database';
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
  const [totalMembers, setTotalMembers] = useState({});
  const MemoizedCard = React.memo(Card);
  const MemoizedDropdown = React.memo(Dropdown);


  React.useEffect(() => {
    console.log("Component rerendered");
    if (!groupId || !user) return;

    const unsubscribeProposals = db.listenForProposalUpdates(groupId, setProposals, console.error);
    const unsubscribeVotes = db.listenForVoteUpdates(groupId, voteUpdates => {
      setProposals(prevProposals => prevProposals.map(proposal => ({
        ...proposal,
        votes: voteUpdates[proposal.id] || proposal.votes
      })));
    });

    const fetchInitialData = async () => {
      try {
        const details = await db.getGroup(groupId);
        const userPlaces = await db.getUserPlaces(user.uid);
        const groupProposals = await db.fetchProposalsByGroup(groupId);
        const userVotes = await db.fetchUserVotesByGroup(groupId, user.uid);
        const totalMembers = details.membersId ? details.membersId.length : 0;

        setGroupDetails(details);
        setPlaces(userPlaces);
        setProposals(groupProposals.map(proposal => ({
          ...proposal,
          totalMembers
        })));
        setUserVotes(userVotes);
        setTotalMembers(totalMembers);

        if (userPlaces.length > 0) {
          setSelectedPlace(userPlaces[0].id);
        }
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();

    return () => {
      unsubscribeProposals();
      unsubscribeVotes();
    };
    
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
      timestamp: new Date(),
      votes: 0,
      totalMembers
    };

    try {
      const proposalId = await db.addProposal(proposalData);
      console.log("Proposal added with ID:", proposalId);
      // setProposals(prevProposals => {
      //   const newProposals = [...prevProposals, { ...proposalData, id: proposalId }];
      //   console.log("New proposals state:", newProposals);
      //   return newProposals;
      // });
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



  const handleVoteToggle = async (proposalId, hasVoted) => {
    try {
      const result = await db.toggleVote(groupId, proposalId, user.uid, hasVoted);

      setUserVotes(prevVotes => ({
        ...prevVotes,
        [proposalId]: result === "vote added" ? true : false
      }));

      // Don't manipulate votes directly, let the listener handle it
      alert(result === "vote added" ? "Vote Added" : "Vote Removed");
    } catch (error) {
      console.error('Error toggling vote:', error);
    }
  };



  return (
    <div style={{ marginLeft: '200px', marginRight: '200px', flexGrow: 1 }}>
        <div className="title has-text-centered" style={{ margin:'20px' }}>
          Welcome Group: {groupDetails ? groupDetails.groupName : "Loading"}
        </div>
        <div className="mt-3" style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/group">
            <button className="button is-info is-small">Back to Group List</button>
          </Link>
        </div>

      <div className='container' style={{ margin: '20px' }}>
        <div className="columns">
          <div className="column is-7">
            {places.length ? (
              <MemoizedDropdown
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
              <MemoizedCard
                key={proposal.id}
                index={index}
                // imageUrl={proposal.imageUrl}
                userId={proposal.userId}
                currentUser={user.uid}
                yelpUrl={proposal.yelpUrl}
                placeName={proposal.name}
                date={proposal.date}
                time={proposal.time}
                votes={proposal.votes}
                onVote={() => handleVoteToggle(proposal.id)}
                onDelete={() => handleDeleteProposal(proposal.id)}
                hasVoted={!!userVotes[proposal.id]}
                totalMembers={proposal.totalMembers}
              />
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;

