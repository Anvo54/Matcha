import { useState, useEffect, useContext } from 'react';
import './browse.css';
import {
	Grid,
	Loader,
	Button,
	Sidebar,
	Menu,
	Segment,
} from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';
import agent from '../../app/api/agent';
import BrowseList from './BrowseList';
import BrowseListSorter from './BrowseListSorter';
import { RootStoreContext } from '../../app/stores/rootStore';
import BrowseListFilter from './BrowseListFilter';

const Browse = () => {
	const [profiles, setProfiles] = useState<IPublicProfile[]>([]);
	const [compatibility, setCompatibility] = useState<number[]>([0, 100]);
	const [ages, setAges] = useState<number[]>([18, 100]);
	const [radius, setRadius] = useState<number[]>([0, 1000]);
	const [famerate, setFamerate] = useState<number[]>([0, 10]);
	const [mutualInterests, setMutualInterests] = useState<number[]>([0, 10]);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const { profile } = rootStore.profileStore;

	useEffect(() => {
		setLoading(true);
		agent.Browse.list()
			.then((profileList) => {
				profileList.sort(
					(a, b) => b.compatibilityRating - a.compatibilityRating
				);
				setProfiles(profileList);
			})
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}, [profile]);

	if (loading) return <Loader active />;

	return (
		<Grid centered>
			<Grid.Column computer="10" tablet="10" mobile="16">
				<Button content="Filter / Sort" onClick={() => setVisible(!visible)} />
				<Sidebar.Pushable as={Segment}>
					<Sidebar
						as={Menu}
						animation="overlay"
						onHide={() => setVisible(false)}
						vertical
						visible={visible}
						style={{ padding: 40 }}
					>
						<BrowseListSorter profiles={profiles} setProfiles={setProfiles} />
						<BrowseListFilter
							setValue={setCompatibility}
							minValue={0}
							maxValue={100}
							name={'Compatibility'}
						/>
						<BrowseListFilter
							setValue={setAges}
							minValue={18}
							maxValue={100}
							name={'Age'}
						/>
						<BrowseListFilter
							setValue={setRadius}
							minValue={0}
							maxValue={1000}
							name={'Radius'}
						/>
						<BrowseListFilter
							setValue={setMutualInterests}
							minValue={0}
							maxValue={10}
							name={'Mutual interests'}
						/>
						<BrowseListFilter
							setValue={setFamerate}
							minValue={0}
							maxValue={10}
							name={'Famerate'}
						/>
					</Sidebar>

					<Sidebar.Pusher>
						<Segment basic style={{ minHeight: '75vh' }}>
							<BrowseList
								profiles={profiles.filter(
									(p) =>
										p.compatibilityRating >= compatibility[0] &&
										p.compatibilityRating <= compatibility[1] &&
										p.age >= ages[0] &&
										p.age <= ages[1] &&
										p.distance >= radius[0] &&
										p.distance <= radius[1] &&
										p.fameRating >= famerate[0] &&
										p.fameRating <= famerate[1] &&
										p.mutualInterests >= mutualInterests[0] &&
										p.mutualInterests <= mutualInterests[1]
								)}
								setProfiles={setProfiles}
							/>
						</Segment>
					</Sidebar.Pusher>
				</Sidebar.Pushable>
			</Grid.Column>
		</Grid>
	);
};

export default Browse;
