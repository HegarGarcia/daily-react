import {
  DailyEventObjectMeetingSessionStateUpdated,
  DailyMeetingSessionState,
  DailyMeetingState,
} from '@daily-co/daily-js';
import React from 'react';
import { atom, useRecoilCallback } from 'recoil';

import { useDaily } from './hooks/useDaily';
import { useDailyEvent } from './hooks/useDailyEvent';
import { RECOIL_PREFIX } from './lib/constants';

export const meetingStateState = atom<DailyMeetingState>({
  key: RECOIL_PREFIX + 'meeting-state',
  default: 'new',
});

export const meetingSessionDataState = atom<DailyMeetingSessionState>({
  key: 'meeting-session-data',
  default: {
    data: undefined,
    topology: 'none',
  },
});

export const DailyMeeting: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const daily = useDaily();

  /**
   * Updates meeting state.
   */
  const updateMeetingState = useRecoilCallback(
    ({ set }) =>
      () => {
        if (!daily) return;
        const meetingState = daily.meetingState();
        set(meetingStateState, meetingState);
        return meetingState;
      },
    [daily]
  );

  useDailyEvent('loading', updateMeetingState);
  useDailyEvent('loaded', updateMeetingState);
  useDailyEvent('joining-meeting', updateMeetingState);
  useDailyEvent('joined-meeting', updateMeetingState);
  useDailyEvent('left-meeting', updateMeetingState);
  useDailyEvent('error', updateMeetingState);

  /**
   * Updates meeting session state.
   */
  const initMeetingSessionState = useRecoilCallback(
    ({ set }) =>
      () => {
        if (!daily) return;
        set(meetingSessionDataState, daily.meetingSessionState());
      },
    [daily]
  );

  /**
   * Initialize state when joined meeting or setting up the hook.
   */
  useDailyEvent('joined-meeting', initMeetingSessionState);

  /**
   * Update Recoil state whenever meeting session state is updated.
   */
  useDailyEvent(
    'meeting-session-state-updated',
    useRecoilCallback(
      ({ set }) =>
        (ev: DailyEventObjectMeetingSessionStateUpdated) => {
          set(meetingSessionDataState, ev.meetingSessionState);
        },
      []
    )
  );

  /**
   * Reset Recoil state when meeting ends.
   */
  useDailyEvent(
    'left-meeting',
    useRecoilCallback(
      ({ reset }) =>
        () => {
          reset(meetingSessionDataState);
        },
      []
    )
  );

  /**
   * Reset Recoil state when call instance is destroyed.
   */
  useDailyEvent(
    'call-instance-destroyed',
    useRecoilCallback(
      ({ reset }) =>
        () => {
          reset(meetingStateState);
        },
      []
    )
  );

  return <>{children}</>;
};
