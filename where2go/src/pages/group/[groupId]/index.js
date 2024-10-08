import Head from "next/head";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dropdown from '@/components/groupVote/dropdown';
import Card from '@/components/groupVote/card';
import * as db from '@/database';
import Link from 'next/link';


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

  const [isMember, setIsMember] = useState(false);


  useEffect(() => {
    console.log("Component rerendered");
    if (!groupId || !user) return;

    const unsubscribeProposals = db.listenForProposalUpdates(groupId, setProposals, console.error);
    const unsubscribeVotes = db.listenForVoteUpdates(groupId, voteUpdates => {
      console.log("voteUpdates received:", voteUpdates);
      setProposals(prevProposals => prevProposals.map(proposal => ({
        ...proposal,
        votes: voteUpdates[proposal.id] || 0
      })));
    });

    const fetchInitialData = async () => {
      try {
        const details = await db.getGroup(groupId);

        if (!details.membersId.includes(user.uid)) {
          alert('You are not a member of this group.');
          router.push('/group');
          return;
        }
        setIsMember(true);


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
    } catch (error) {
      console.error('Error adding proposal:', error);
    }
  };



  const handleDeleteProposal = async (proposalId) => {
    const userConfirmed = window.confirm("Are you sure you want to delete this proposal?");

    if (userConfirmed) {
      try {
        await db.deleteProposal(proposalId);
        setProposals(prevProposals => prevProposals.filter(proposal => proposal.id !== proposalId));
        console.log("Proposal deleted successfully.");
      } catch (error) {
        console.error('Error deleting proposal:', error);
        alert("Failed to delete the proposal.");
      }
    } else {
      console.log("User decided not to delete the proposal.");
    }
  };



  const handleVoteToggle = async (proposalId) => {
    const hasVoted = userVotes[proposalId];

    setProposals(prevProposals => prevProposals.map(proposal => {
      if (proposal.id === proposalId) {
        const adjustedVotes = hasVoted ? proposal.votes - 1 : proposal.votes + 1;
        return { ...proposal, votes: adjustedVotes };
      }
      return proposal;
    }));
    setUserVotes(prevVotes => ({
      ...prevVotes,
      [proposalId]: !hasVoted
    }));

    try {
      const result = await db.toggleVote(groupId, proposalId, user.uid, hasVoted);
      alert(result === "vote added" ? "Vote Added" : "Vote Removed");
    } catch (error) {
      console.error('Error toggling vote:', error);
      setProposals(prevProposals => prevProposals.map(proposal => {
        if (proposal.id === proposalId) {
          const adjustedVotes = hasVoted ? proposal.votes + 1 : proposal.votes - 1;
          return { ...proposal, votes: adjustedVotes };
        }
        return proposal;
      }));
      setUserVotes(prevVotes => ({
        ...prevVotes,
        [proposalId]: hasVoted
      }));
      alert("Failed to toggle vote.");
    }
  };




  return (
    <>
      <Head>
        <title>Group: {groupDetails ? groupDetails.groupName : "Loading"} </title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/hands-up.png" />
      </Head>

      {isMember ? (
        <div style={{ marginLeft: '200px', marginRight: '200px' }}>
          <div className="title has-text-centered" style={{ margin: '20px' }}>
            Welcome Group: {groupDetails ? groupDetails.groupName : "Loading"}
          </div>
          <div className="mt-3" style={{ display: 'flex', justifyContent: 'center', margin: '50px' }}>
            <Link href="/group">
              <button className="button is-info is-small">Back to Group List</button>
            </Link>
          </div>

          <div>
            <p className="notification is-info is-light" style={{ textAlign: 'center' }}>
              After adding or deleting a proposal,
              please refresh the page to ensure you view the most updated votes.
              Thank you
            </p>
          </div>

          <div className='container' style={{ margin: '20px' }}>
            <div className="columns">
              <div className="column is-6">
                {places.length ? (
                  <MemoizedDropdown
                    options={places.map(place => ({
                      value: place.id,
                      label: place.name,
                      yelpUrl: place.yelpUrl
                    }))}
                    onPropose={handlePropose}
                    startDate={groupDetails.startDate}
                    endDate={groupDetails.endDate}
                  />
                ) : (
                  <p className="notification is-primary is-light" style={{ textAlign: 'center' }}>
                    No places available.<br />
                    Please add some places at your
                    <strong>
                      <Link href="/private" style={{ textDecoration: 'none', color: 'blue' }}> Private Space</Link>
                    </strong> first!
                  </p>
                )}
              </div>

              <div className="column is-6" style={{ minHeight: '700px' }}>

                <p className="notification is-warning is-light" style={{ textAlign: 'center' }}>
                  Please choose from the <strong>options</strong> on the left <br />or view the
                  <strong> Proposals </strong> submitted by others below.
                </p>

                {proposals.map((proposal, index) => (
                  <MemoizedCard
                    key={proposal.id}
                    index={index}
                    userId={proposal.userId}
                    currentUser={user ? user.uid : null}
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
      ) : (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>You do not have permission to view this page.</p>
        </div>
      )}
    </>
  );
};

export default GroupDetailsPage;

