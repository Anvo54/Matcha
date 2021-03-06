import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Divider, Dropdown, DropdownProps, Segment } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import MobileChatPane from './MobileChatPane';

const MobileChat = () => {
	const rootStore = useContext(RootStoreContext);
	const { chats } = rootStore.chatStore;
	const [selectedChat, setSelectedChat] = useState(chats[0].chatId);

	const chatOptions = chats.map((chat) => ({
		key: chat.chatId,
		text: chat.participant.firstName,
		value: chat.chatId,
		image: { avatar: true, src: chat.participant.image.url },
		label: chat.unread && {
			color: 'red',
			empty: true,
			circular: true,
			size: 'mini',
		},
	}));

	const handleSelect = (
		_event: React.SyntheticEvent<HTMLElement, Event>,
		data: DropdownProps
	) => {
		if (data.value) {
			setSelectedChat(data.value.toString());
		}
	};

	return (
		<Segment>
			<Dropdown
				inline
				onChange={handleSelect}
				defaultValue={chats[0].chatId}
				options={chatOptions}
			/>
			<Divider />
			<MobileChatPane chat={chats.find(c => c.chatId === selectedChat)!} />
		</Segment>
	);
};

export default observer(MobileChat);
