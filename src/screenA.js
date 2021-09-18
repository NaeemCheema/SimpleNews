import * as React from 'react';
import { View, FlatList, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';

const paginationOffSet = 15;
class ScreenA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storiesID: [],
            storiesData: [],
            isLoading: false,
            pagination: paginationOffSet
        }
    }

    componentDidMount() {
        console.log("componentDidMount");
        this.getStoriesIDs();
    }

    getStoriesIDs = async () => {
        console.log("getStoriesIDs");
        try {
            this.setState({ isLoading: true });
            const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
            const data = response.status == 200 ? await response.json() : [];
            this.setState({ storiesID: data });
            this.getStoryDetails(data.slice(0, this.state.pagination));
        }
        catch (error) {
            console.error(error.message);
            this.setState({ isLoading: false });
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    getStoryDetails = async (storiesID) => {
        console.log("getStoryDetails pagination", this.state.pagination);
        try {
            if (storiesID.length > 0) {
                let storyResults = [];
                for (const storyID of storiesID) {
                    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyID}.json`);
                    const story = res.status == 200 ? await res.json() : null;
                    if (story) storyResults.push(story);
                }
                this.setState({ storiesData: [...this.state.storiesData, ...storyResults] }, () => {
                    this.setState({ pagination: this.state.pagination + paginationOffSet });
                });
            }
        }
        catch (error) {
            console.log(error.message);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    loadMoreStories = () => {
        console.log('loadMoreStories');
        this.setState({ isLoading: true });
        const { storiesID, pagination } = this.state;
        if (pagination < storiesID.length) {
            this.getStoryDetails(storiesID.slice(pagination, pagination + paginationOffSet));
        } else {
            this.setState({ isLoading: false });
        }
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('ScreenB', {
                data: item
            })}>
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
        const { storiesData } = this.state;
        return (
            <View style={styles.container}>
                <Image source={{ uri: 'https://picsum.photos/id/237/200/300' }} style={styles.image} />
                <FlatList
                    data={storiesData}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={this.renderFooter}
                    onEndReached={this.loadMoreStories}
                    onEndReachedThreshold={0.4}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'center'
    },
    item: {
        marginHorizontal: 10,
        marginVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    title: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: "700",
    },
    loader: {
        marginVertical: 10,
        alignItems: 'center'
    }
})

export default ScreenA;