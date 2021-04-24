import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Image, Button, Grid, Header } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IPublicProfile } from '../../app/models/profile';

const Matches = () => {
	const [profiles, setProfiles] = useState<IPublicProfile[]>([]);
	useEffect(() => {
		agent.Matches.list()
			.then((p) => setProfiles(p))
			.catch((e) => console.log(e));
	}, []);
	return profiles.length < 1 ? (
		<Header>No matches :(</Header>
	) : (
		<Container>
			<Grid stackable divided="vertically">
				<Grid.Row divided columns="3">
					{profiles!.sort().map((profile) => (
						<Grid.Column
							key={profile.id}
							as={Link}
							to={`/profile/${profile.id}`}
						>
							<Image
								src={profile.images.find((i) => i.isMain)?.url}
								label={{
									color: profile.lastSeen !== 'online' ? 'grey' : 'pink',
									attached: 'top right',
									content:
										profile.lastSeen !== 'online'
											? `Last seen: ${profile.lastSeen}`
											: 'Online',
								}}
							/>
							<Header as="h5">
								{profile.firstName} {profile.lastName}
							</Header>
							Distance: {profile.distance} km
							{profile.lastSeen === 'online' && (
								<Button
									color="pink"
									icon="heart"
									size="big"
									content="Start Chat"
									as={Link}
									to={'/chat'}
									fluid
								/>
							)}
						</Grid.Column>
					))}
				</Grid.Row>
			</Grid>
		</Container>
	);
};

export default Matches;
