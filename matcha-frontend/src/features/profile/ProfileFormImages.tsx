import React, { Fragment, useContext, useState } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileFormImagesDisplay from './ProfileFormImagesDisplay';
import ImageUpload from '../../app/common/imageUpload/ImageUpload';
import { observer } from 'mobx-react-lite';

const ProfileFormImages = () => {
	const [addImageMode, setAddImageMode] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const {
		profile,
		removeImage,
		addImage,
		setMain,
	} = rootStore.profileStore;

	return (
		<Fragment>
			<Grid columns="equal">
				<Grid.Column>
					<Header size="large" color="pink" content="Your images" />
				</Grid.Column>
				<Grid.Column>
					<Button
						floated="right"
						type="button"
						disabled={profile!.images.length === 5}
						primary
						content={addImageMode ? 'Cancel' : 'Add Photo'}
						onClick={() => setAddImageMode(!addImageMode)}
					/>
				</Grid.Column>
			</Grid>

			{addImageMode && profile ? (
				<ImageUpload
					setAddImageMode={setAddImageMode}
					addImage={addImage}
				/>
			) : (
				<ProfileFormImagesDisplay
					removeImage={removeImage}
					setMain={setMain}
					profile={profile!}
				/>
			)}
		</Fragment>
	);
};

export default observer(ProfileFormImages);
