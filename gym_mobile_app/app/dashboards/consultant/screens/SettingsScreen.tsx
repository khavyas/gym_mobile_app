import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const SettingsScreen: React.FC = () => {
	return (
		<View style={styles.container}>
			{/* Add your settings content here */}
			<Text style={styles.text}>Settings Screen</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#111827',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: '#fff',
		fontSize: 20,
	},
});

export default SettingsScreen;
