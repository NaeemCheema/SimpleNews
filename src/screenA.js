import * as React from 'react';
import { View, FlatList, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';

// set offset variable for pagination
const paginationOffSet = 15;
class ScreenA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storiesID: [],
            storiesData: [],
            showLoader: false,
            isLoading: false,
            pagination: paginationOffSet,
            error: '',
        }
    }

    componentDidMount() {
        // call function to get data from API
        this.getStoriesIDs();
    }

    getStoriesIDs = async () => {
        try {
            this.setState({ showLoader: true });
            // get stories ID's
            const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
            const data = response.status == 200 ? await response.json() : [];

            // set stories ID's
            this.setState({ storiesID: data });
            // fetch only first 15 stories detail
            this.getStoryDetails(data.slice(0, this.state.pagination))
                .then(() => {
                    this.setState({ showLoader: false });
                })
        }
        catch (error) {
            // set error message
            this.setState({ error: error.message });
        }
    }

    // get stories detail function (made async to use callback in get stories ID's)
    getStoryDetails = async (storiesID) => {
        console.log("getStoryDetails pagination", this.state.pagination);
        try {
            // check stories ids array have valid length
            if (storiesID.length > 0) {
                // make empty array to push each story data
                let storyResults = [];
                // use forof because of async function
                for (const storyID of storiesID) {
                    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyID}.json`);
                    const story = res.status == 200 ? await res.json() : null;
                    if (story) storyResults.push(story);
                }
                // set valid stories data and pagination into callback
                this.setState({ storiesData: [...this.state.storiesData, ...storyResults] }, () => {
                    this.setState({ pagination: this.state.pagination + paginationOffSet });
                });
            } else {
                // stories ids array don't valid length so throw error
                throw new Error('There are no stories');
            }
        }
        catch (error) {
            // catch error and set into error state
            this.setState({ error: error.message });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    loadMoreStories = () => {
        // call function once scroll reached on threshold value
        this.setState({ isLoading: true });
        const { storiesID, pagination } = this.state;
        if (pagination < storiesID.length) {
            this.getStoryDetails(storiesID.slice(pagination, pagination + paginationOffSet));
        } else {
            this.setState({ isLoading: false });
        }
    }

    // render item function
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.item}
                // pass the story detail data as an props to ScreenB
                onPress={() => this.props.navigation.navigate('ScreenB', {
                    data: item
                })}
            >
                <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    renderFooter = () => {
        const { isLoading } = this.state;
        return (
            isLoading ?
                <View style={styles.loader}>
                    <ActivityIndicator size="small" />
                </View> : null
        )
    }

    render() {
        const { storiesData, showLoader, error } = this.state;
        return (
            <View style={styles.container}>
                {(!showLoader && error === '') && (
                    <React.Fragment>
                        <Image source={{ uri: 'https://picsum.photos/id/237/200/300' }} style={styles.image} />
                        <FlatList
                            data={storiesData}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={this.renderFooter}
                            onEndReached={this.loadMoreStories}
                            onEndReachedThreshold={0.4}
                        />
                    </React.Fragment>
                )}
                {(showLoader && error === '') && (
                    <View style={styles.content}>
                        <ActivityIndicator size="large" color='#000000' />
                    </View>
                )}
                {error !== '' && (
                    <View style={styles.content}>
                        <Text style={styles.error}>{error}</Text>
                    </View>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'center',
    },
    item: {
        marginHorizontal: 10,
        marginVertical: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderColor: '#ccc',
        borderRadius: 5,
        borderWidth: 1,
    },
    title: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: "700",
    },
    loader: {
        marginVertical: 10,
        alignItems: 'center'
    },
    error: {
        fontSize: 16,
        fontWeight: "700",
        color: '#cc0000',
        textAlign: 'center'
    }
})

export default ScreenA;