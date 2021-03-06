import { Form as FinalForm, Field } from 'react-final-form';
import {
	Form,
	Button,
	Divider,
	Header,
	Loader,
	Dimmer,
} from 'semantic-ui-react';
import agent from '../../app/api/agent';
import TextInput from '../../app/common/form/TextInput';
import React, { useEffect, useState } from 'react';
import SelectInput from '../../app/common/form/SelectInput';
import MultiSelectInput from '../../app/common/form/MultiSelectInput';
import { observer } from 'mobx-react-lite';
import { formValidation } from './ProfileValidation';
import { IInterestOption } from '../../app/models/interest';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import ProfileFormImages from './ProfileFormImages';
import {
	IPrivateProfile,
	IProfileFormValues,
	profileToFormValues,
} from '../../app/models/profile';
import DateInput from '../../app/common/form/DateInput';

const gender = [
	{ key: 'female', value: 'Female', text: 'Female' },
	{ key: 'male', value: 'Male', text: 'Male' },
];

const sexualPreference = [
	{ key: 'female', text: 'Female', value: 'Female' },
	{ key: 'male', text: 'Male', value: 'Male' },
	{ key: 'both', text: 'Both', value: 'Both' },
];

interface IProps {
	profile: IPrivateProfile;
	updateProfile: (data: IProfileFormValues) => Promise<void | any>;
	closeModal: () => void;
}

interface IConditionProps {
	when: any;
	is: any;
	children: any;
}

const Condition: React.FC<IConditionProps> = ({ when, is, children }) => (
	<Field name={when} subscription={{ value: true }}>
		{({ input: { value } }) => (value === is ? children : null)}
	</Field>
);

const ProfileForm: React.FC<IProps> = ({
	profile,
	updateProfile,
	closeModal,
}) => {
	const [interests, setInterests] = useState<IInterestOption[]>([]);
	const [interestsLoading, setInterestsLoading] = useState(false);

	useEffect(() => {
		if (interests.length === 0) {
			setInterestsLoading(true);
			agent.Interests.get()
				.then((interests) => setInterests(interests))
				.catch((error) => console.log(error))
				.finally(() => setInterestsLoading(false));
		}
	}, [interests.length]);

	if (interestsLoading)
		return (
			<Dimmer active inverted>
				<Loader />
			</Dimmer>
		);

	return (
		<>
			<FinalForm
				onSubmit={updateProfile}
				initialValues={profileToFormValues(profile)}
				validate={formValidation.validateForm}
				render={({
					handleSubmit,
					submitting,
					submitError,
					dirtySinceLastSubmit,
				}) => (
					<Form onSubmit={handleSubmit} error>
						<Header size="large" color="pink" content="Personal information" />
						<Form.Group widths={2}>
							<Field
								component={TextInput}
								name="firstName"
								placeholder="First name"
							/>
							<Field
								component={TextInput}
								name="lastName"
								placeholder="Last name"
							/>
						</Form.Group>
						<Form.Group widths={3}>
							<Field
								name="birthDate"
								component={DateInput}
								label="Birth Date"
							/>
							<Field
								name="gender"
								options={gender}
								placeholder="Gender"
								component={SelectInput}
							/>
							<Field
								name="sexualPreference"
								options={sexualPreference}
								placeholder="Sexual Preference"
								component={SelectInput}
							/>
						</Form.Group>
						<Form.Group widths="equal">
							<Field
								component={MultiSelectInput}
								allowAdditions={true}
								placeholder="Interests"
								name="interests"
								options={interests}
							/>
							<Field
								component={TextInput}
								placeholder="Biography"
								name="biography"
							/>
						</Form.Group>
						<Field
							name="locationOverride"
							type="checkbox"
							render={({ input }) => (
								<Form.Field>
									<div className="ui checkbox">
										<input type="checkbox" {...input} />
										<label>Override location</label>
									</div>
								</Form.Field>
							)}
						/>
						<Condition when="locationOverride" is={true}>
							<Form.Group widths={2}>
								<Field
									name="location.latitude"
									placeholder="Latitude"
									component={TextInput}
								/>
								<Field
									name="location.longitude"
									placeholder="Longitude"
									component={TextInput}
								/>
							</Form.Group>
						</Condition>
						<Divider />
						<ProfileFormImages />
						<Divider />
						{submitError && !dirtySinceLastSubmit && (
							<ErrorMessage message={submitError} />
						)}

						<Button
							primary
							floated="right"
							content="Save"
							loading={submitting}
							disabled={submitting}
							style={{ marginBottom: '10px' }}
						/>
						<Button
							type="button"
							basic
							floated="right"
							content="Close"
							disabled={submitting}
							style={{ marginBottom: '10px' }}
							onClick={closeModal}
						/>
					</Form>
				)}
			/>
		</>
	);
};

export default observer(ProfileForm);
