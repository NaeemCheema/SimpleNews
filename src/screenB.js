import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import WebView from 'react-native-webview';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

// Foating navigation function to handle navigations inside webview
const FloatingNavigation = ({ onBackPress, onForwardPress, canGoBack, canGoForward }) => {
    return (
        <View style={[styles.floatingContainer, (!canGoBack && !canGoForward) && styles.hideContainer]}>
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
            canGoForward: false,
        }
    }

    handleWebViewNavigationState = (navState) => {
        // set webview nativation states
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

    renderSpinner = () => {
        return (
            <View style={styles.content}>
                <ActivityIndicator size="large" color='#000000' />
            </View>
        )
    }

    renderError = (error) => {
        <View style={styles.content}>
            <Text style={styles.error}>{error}</Text>
        </View>
    }

    render() {
        const { url, canGoBack, canGoForward, spinner } = this.state;
        return (
            <View style={styles.container}>
                <WebView
                    ref={ref => (this.webview = ref)}
                    source={{ uri: url }}
                    originWhitelist={['*']} // allow origin's to move navigate inside webview
                    onNavigationStateChange={this.handleWebViewNavigationState}
                    startInLoadingState={true}
                    renderLoading={this.renderSpinner}
                    renderError={(errorName) => this.renderError(errorName)}
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
    content: {
        position: 'absolute',
        top: SCREEN_HEIGHT / 2,
        left: SCREEN_WIDTH / 2
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
    },
    error: {
        fontSize: 16,
        fontWeight: "700",
        color: '#cc0000',
        textAlign: 'center'
    }
})

export default ScreenB;