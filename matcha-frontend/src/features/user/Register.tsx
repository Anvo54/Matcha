import React, { useContext } from 'react';
import { Form, Button, Modal, Message } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { IRegisterFormValues } from '../../app/models/user';
import TextInput from './TextInput';
import { IValidationError } from '../../app/models/errors';
import { ErrorMessage } from '@hookform/error-message';

const Register = () => {
	const rootStore = useContext(RootStoreContext);
	const {
		registerOpen,
		closeRegister,
		registerFinishOpen,
		closeRegisterFinish,
	} = rootStore.modalStore;
	const { registerUser, loading } = rootStore.userStore;
	const { register, handleSubmit, errors, setError } = useForm();

	const onSubmit = (data: IRegisterFormValues) => {
		console.log('ksdhf')
		registerUser(data).catch((error) => {
			if (error.error_type === 'ValidationError') {
				error.errors.forEach((err: IValidationError) => {
					setError(err.field, { type: 'manual', message: err.message });
				});
			} else {
				setError('global', { type: 'manual', message: error.message });
			}
		});
	};

	const validatePassword = (value: string) => {
		if (value.length < 6) {
			return 'Password should be at-least 6 characters.';
		} else if (
			!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*?_])/.test(value)
		) {
			return 'Password should contain at least one uppercase letter, lowercase letter, digit, and special symbol.';
		}
		return true;
	};

	return (
		<Modal size="tiny" open={registerOpen} onClose={closeRegister}>
			<Modal.Header>Register</Modal.Header>
			<Modal.Description />
			<Modal.Content>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInput
						type="text"
						name="username"
						label="Username"
						errors={errors}
						register={register({
							required: 'Username is required',
						})}
					/>
					<TextInput
						type="text"
						name="firstName"
						label="First name"
						errors={errors}
						register={register({
							required: 'Firstname is required',
						})}
					/>
					<TextInput
						type="text"
						name="lastName"
						label="Last name"
						errors={errors}
						register={register({
							required: 'Lastname is required',
						})}
					/>
					<TextInput
						type="text"
						name="emailAddress"
						label="Email address"
						errors={errors}
						register={register({
							required: 'Email is required',
							pattern: {
								value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
								message: 'Email is not valid',
							},
						})}
					/>
					<TextInput
						type="password"
						name="password"
						label="Password"
						errors={errors}
						register={register({
							required: 'Password is required',
							validate: validatePassword,
						})}
					/>
					<ErrorMessage
						errors={errors}
						name="global"
						render={({ message }) => <Message negative>{message}</Message>}
					/>
					<Button primary type="submit" loading={loading}>
						Register
					</Button>
				</Form>
				<Modal open={registerFinishOpen} size="small">
					<Modal.Header>All done!</Modal.Header>
					<Modal.Content>
						<p>Confirmation email sent!</p>
						<i>Please check your email</i>
					</Modal.Content>
					<Modal.Actions>
						<Button
							primary
							icon="check"
							content="All Done"
							onClick={closeRegisterFinish}
						/>
					</Modal.Actions>
				</Modal>
			</Modal.Content>
		</Modal>
	);
};

export default observer(Register);
