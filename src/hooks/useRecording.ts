import { DailyCall, DailyEventObject } from '@daily-co/daily-js';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';

import { recordingState } from '../DailyRecordings';
import { useDaily } from './useDaily';
import { useDailyEvent } from './useDailyEvent';

interface UseRecordingArgs {
  onRecordingData?(ev: DailyEventObject<'recording-data'>): void;
  onRecordingError?(ev: DailyEventObject<'recording-error'>): void;
  onRecordingStarted?(ev: DailyEventObject<'recording-started'>): void;
  onRecordingStopped?(ev: DailyEventObject<'recording-stopped'>): void;
}

export const useRecording = ({
  onRecordingData,
  onRecordingError,
  onRecordingStarted,
  onRecordingStopped,
}: UseRecordingArgs = {}) => {
  const daily = useDaily();
  const state = useRecoilValue(recordingState);

  useDailyEvent(
    'recording-started',
    useCallback(
      (ev: DailyEventObject<'recording-started'>) => {
        onRecordingStarted?.(ev);
      },
      [onRecordingStarted]
    )
  );
  useDailyEvent(
    'recording-stopped',
    useCallback(
      (ev: DailyEventObject<'recording-stopped'>) => {
        onRecordingStopped?.(ev);
      },
      [onRecordingStopped]
    )
  );
  useDailyEvent(
    'recording-error',
    useCallback(
      (ev: DailyEventObject<'recording-error'>) => {
        onRecordingError?.(ev);
      },
      [onRecordingError]
    )
  );
  useDailyEvent(
    'recording-data',
    useCallback(
      (ev: DailyEventObject<'recording-data'>) => {
        onRecordingData?.(ev);
      },
      [onRecordingData]
    )
  );

  /**
   * Starts the recording with the given optional options.
   */
  const startRecording = useCallback(
    (...args: Parameters<DailyCall['startRecording']>) => {
      if (!daily) return;
      daily.startRecording(...args);
    },
    [daily]
  );

  /**
   * Stops a recording.
   */
  const stopRecording = useCallback(
    (...args: Parameters<DailyCall['stopRecording']>) => {
      if (!daily) return;
      daily.stopRecording(...args);
    },
    [daily]
  );

  /**
   * Updates a running recording's layout configuration.
   */
  const updateRecording = useCallback(
    (...args: Parameters<DailyCall['updateRecording']>) => {
      if (!daily) return;
      daily.updateRecording(...args);
    },
    [daily]
  );

  return {
    ...state,
    startRecording,
    stopRecording,
    updateRecording,
  };
};
