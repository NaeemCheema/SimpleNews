import * as React from 'react';
import { View, Dimensions, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Touchable, Button } from 'react-native';
import WebView from 'react-native-webview';

const FloatingNavigation = ({ onBackPress, onForwardPress, canGoBack, canGoForward }) => {
    return (
        <View style={[styles.floatingContainer, (!canGoBack && !canGoForward) && styles.hideContainer ]}>
            {canGoBack && (
                <TouchableOpacity style={styles.button} onPress={onBackPress}>
                    <Text style={styles.buttonTitle}>Back</Text>
                </TouchableOpacity>
            )}
            {canGoForward && (
                <TouchableOpacity style={styles.button} onPress={onForwardPress}>
                    <Text style={styles.buttonTitle}>Forward</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

class ScreenB extends React.Component {
    constructor(props) {
        super(props);
        const { data } = props.route.params;
        this.state = {
            url: data.url,
            canGoBack: false,
            canGoForward: false
        }
    }

    handleWebViewNavigationState = (navState) => {
        this.setState({
            canGoBack: navState.canGoBack,
            canGoForward: navState.canGoForward
        });
    };

    handleBackPress = () => {
        this.webview.goBack();
    }

    handleForwardPress = () => {
        this.webview.goForward();
    }

    render() {
        const { url, canGoBack, canGoForward } = this.state;
        return (
            <View style={styles.container}>
                <WebView
                    ref={ref => (this.webview = ref)}
                    source={{ uri: url }}
                    originWhitelist={['https://*', 'git://*']}
                    onNavigationStateChange={this.handleWebViewNavigationState}
                />
                <FloatingNavigation
                    onBackPress={() => this.handleBackPress()}
                    onForwardPress={() => this.handleForwardPress()}
                    canGoBack={canGoBack}
                    canGoForward={canGoForward}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    floatingContainer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ccc',
        height: 60,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    button: {
        backgroundColor: 'transparent',
        marginVertical: 5,
        marginHorizontal: 25
    },
    buttonTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600'
    },
    hideContainer: {
        display: 'none'
    }
})

export default ScreenB;