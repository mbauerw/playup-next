import { MultipleTracks } from '@/types';
import { rankSongPopularity } from '../parsers/parseAlbumTracks';

describe('rankSongPopularity', () => {
  it('should sort tracks by popularity in descending order', () => {
    // Arrange
    const multipleTracks = {
      tracks: [
        { id: '1', name: 'Low Popular', popularity: 30 },
        { id: '2', name: 'High Popular', popularity: 90 },
        { id: '3', name: 'Medium Popular', popularity: 60 },
      ]
    } as MultipleTracks;

    // Act
    const result = rankSongPopularity(multipleTracks);

    // Assert
    expect(result.tracks[0].popularity).toBe(90);
    expect(result.tracks[1].popularity).toBe(60);
    expect(result.tracks[2].popularity).toBe(30);
    expect(result.tracks[0].name).toBe('High Popular');
  });

  it('should handle tracks with undefined popularity', () => {
    const multipleTracks = {
      tracks: [
        { id: '1', popularity: undefined },
        { id: '2', popularity: 50 },
        { id: '3', popularity: null },
      ]
    } as MultipleTracks;
  
    const result = rankSongPopularity(multipleTracks);
  
    // Track with popularity 50 should be first
    expect(result.tracks[0].popularity).toBe(50);
    
    // undefined and null stay as they are (not converted to 0)
    // They're just sorted to the end
    expect(result.tracks[1].popularity).toBeUndefined(); // Still undefined
    expect(result.tracks[2].popularity).toBeNull(); // Still null
    
    // Or you can check they're falsy without caring which is which:
    expect(result.tracks[1].popularity).toBeFalsy();
    expect(result.tracks[2].popularity).toBeFalsy();
  });
});