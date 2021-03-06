import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Label, Popup } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

interface IProps {
	logoutUser: () => void;
}

const MobileMenu: React.FC<IProps> = ({ logoutUser }) => {
	const rootStore = useContext(RootStoreContext);
	const { unreadNotificationsCount } = rootStore.profileStore;
	const { unreadChats } = rootStore.chatStore;
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<Fragment>
			<Menu.Menu position="right">
				<Popup
					trigger={
						<Menu.Item>
							{unreadChats.length + unreadNotificationsCount > 0 && (
								<Label
									circular
									color="red"
									size="mini"
									className="notificationBall"
									content={unreadChats.length + unreadNotificationsCount}
								/>
							)}
							<Icon name="bars" size="massive" />
							Menu
						</Menu.Item>
					}
					position="bottom center"
					on="click"
					pinned
					style={{ padding: 0 }}
					open={menuOpen}
					onOpen={() => setMenuOpen(true)}
					onClose={() => setMenuOpen(false)}
				>
					<Menu vertical>
						<Menu.Item
							as={Link}
							to="/matches"
							name="matches"
							onClick={() => setMenuOpen(false)}
						>
							<Icon name="fire"></Icon>
							Matches
						</Menu.Item>
						<Menu.Item
							as={Link}
							to="/research"
							name="research"
							onClick={() => setMenuOpen(false)}
						>
							<Icon name="users" />
							Research
						</Menu.Item>
						<Menu.Item
							as={Link}
							to="/profile"
							name="myprofile"
							onClick={() => setMenuOpen(false)}
						>
							<Icon name="user circle" />
							My Profile
						</Menu.Item>
						<Menu.Item
							as={Link}
							to="/chat"
							name="chat"
							onClick={() => setMenuOpen(false)}
						>
							Chat
							<span style={{ float: 'right' }}>
								<Icon
									name="comments"
									style={{ marginRight: 0, marginLeft: 5 }}
								/>
							</span>
							{unreadChats.length > 0 && (
								<Label
									circular
									color="red"
									size="mini"
									content={unreadChats.length}
								/>
							)}
						</Menu.Item>
						<Menu.Item
							name="notifications"
							as={Link}
							to="/notifications"
							onClick={() => setMenuOpen(false)}
						>
							Notifications
							<span style={{ float: 'right' }}>
								<Icon name="bell" style={{ marginRight: 0, marginLeft: 5 }} />
							</span>
							{unreadNotificationsCount > 0 && (
								<Label
									circular
									color="red"
									size="mini"
									content={unreadNotificationsCount}
								/>
							)}
						</Menu.Item>
					</Menu>
				</Popup>

				<Menu.Item as={Link} to="/" name="logout" onClick={logoutUser}>
					<Icon name="times" />
					Logout
				</Menu.Item>
			</Menu.Menu>
		</Fragment>
	);
};

export default observer(MobileMenu);
