const API_URL = process.env.REACT_APP_API_URL;

export const fetchSongs = async () => {
    const response = await fetch(`${API_URL}/songs`);
    if (!response.ok) {
        throw new Error('Failed to fetch songs');
    }
    return await response.json();
};

export const fetchSongDetails = async (id) => {
    const response = await fetch(`${API_URL}/songs/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch details for song with id ${id}`);
    }
    return await response.json();
};