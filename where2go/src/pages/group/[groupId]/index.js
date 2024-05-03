import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dropdown from '@/components/groupVote/dropdown';
import Card from '@/components/groupVote/card';
import * as db from '@/database';
import styles from '@/styles/GroupDetails.module.css';
import Link from 'next/link';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";


const GroupDetailsPage = ({ user }) => {
  const router = useRouter();
  const { groupId } = router.query;
  const [groupDetails, setGroupDetails] = useState(null);
  const [places, setPlaces] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('');

  useEffect(() => {
    if (!groupId || !user) return;

    const fetchInitialData = async () => {
      try {
        const details = await db.getGroup(groupId);
        const userPlaces = await db.getUserPlaces(user.uid);
        const groupProposals = await db.fetchProposalsByGroup(groupId);
        setGroupDetails(details);
        setPlaces(userPlaces);
        setProposals(groupProposals);
        if (userPlaces.length > 0) {
          setSelectedPlace(userPlaces[0].id); // Set the initial selected place
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [groupId, user]);

  const handlePlaceSelection = async (selectedPlaceId) => {
    const selectedPlace = places.find(place => place.id === selectedPlaceId);
    if (selectedPlace) {
      try {
        const proposalId = await db.addProposal({
          groupId,
          userId: user.uid,
          placeId: selectedPlaceId,
          imageUrl: selectedPlace.imageUrl,
          yelpUrl: selectedPlace.yelpUrl,
          name: selectedPlace.name,
          timestamp: new Date()
        });
        setProposals(prevProposals => [...prevProposals, { ...selectedPlace, id: proposalId }]);
      } catch (error) {
        console.error('Error adding proposal:', error);
      }
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


  const handleVote = async (proposalId) => {
    try {
      await db.submitVote(groupId, proposalId, user.uid);
      alert('Vote submitted!');
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };


  return (
    <div>
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

      <div className="columns">
        <div className="column is-6">
          {places.length ? (
            <Dropdown
              options={places.map(place => ({ value: place.id, label: place.name }))}
              value={selectedPlace}
              onChange={handlePlaceSelection}
            />
          ) : (
            <p className="notification is-primary">
              No places available. Please add some places at your Private Space first
            </p>
          )}
        </div>


        <div className="column is-6">

          {proposals.map(proposal => (
            <Card
              key={proposal.id}
              imageUrl={proposal.imageUrl}
              yelpUrl={proposal.yelpUrl}
              placeName={proposal.name}
              votes={proposal.votes} // Ensure that your proposal object has a votes field
              onVote={() => handleVote(proposal.id)}
              onDelete={() => handleDeleteProposal(proposal.id)}
            />
          ))}

        </div>

      </div>
    </div>
  );
};

export default GroupDetailsPage;

