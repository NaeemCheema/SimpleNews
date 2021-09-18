import * as React from 'react';
import { View, FlatList, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

const App = () => {
    const [storiesID, setStoriesID] = React.useState([]);
    const [stories, setStories] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [scrollIndex, setScrollIndex] = React.useState(20);


    React.useEffect(() => {
        console.log("UseEffect");
        setIsLoading(true);
        getStoriesIDs();
    }, [])

    const getStoriesIDs = async () => {
        console.log("getStoriesIDs");
        try {
            fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
                .then((response) => response.json())
                .then((data) => {
                    setStoriesID(data);
                    data.length > 0 && data.slice(0, 20).forEach(storyID => {
                        fetch(`https://hacker-news.firebaseio.com/v0/item/${storyID}.json`)
                            .then((res) => res.json())
                            .then((story) => {
                                story ? setStories(stories.concat(story)) : null;
                            })
                    });
                })
        }
        catch (error) {
            console.error(error.message);
        }
        finally {
            setIsLoading(false);
        }
    }

    const getStoryDetails = (storiesID) => {
        console.log("getStoryDetails");
        try {
            var storyArr = [];
            storiesID.length > 0 && storiesID.forEach(storyID => {
                fetch(`https://hacker-news.firebaseio.com/v0/item/${storyID}.json`)
                    .then((res) => res.json())
                    .then((story) => {
                        story ?  storyArr.push(story): null;
                    })
            });
            setStories(storyArr)
        }
        catch (error) {
            console.log(error.message);
        }
    }

    const loadMoreStories = () => {
        console.log('loadMoreStories scrollIndex:', scrollIndex);
        if (scrollIndex < 500) {
            let lastIndex = scrollIndex;
            setScrollIndex(scrollIndex + 20);
            getStoryDetails(storiesID.slice(lastIndex, scrollIndex));
        }
        return;
    }

    renderItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
            </View>
        )
    }

    renderFooter = () => {
        return (
            isLoading ?
                <View style={styles.loader}>
                    <ActivityIndicator size="small" />
                </View> : null
        )
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: 'https://picsum.photos/id/237/200/300' }} style={styles.image} />
            <FlatList
                style={styles.list}
                data={stories}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={this.renderFooter}
                onEndReached={() => loadMoreStories()}
                onEndReachedThreshold={0.7}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 0,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'center'
    },
    item: {
        marginVertical: 20,
        marginHorizontal: 10,
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

export default App;