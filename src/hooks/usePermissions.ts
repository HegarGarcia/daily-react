import { useLocalSessionId } from './useLocalSessionId';
import { useParticipantProperty } from './useParticipantProperty';

/**
 * Returns parsed permissions for a given participant.
 * In case no `sessionId` is passed, the hook returns permissions for the local participant.
 * @param sessionId The participant's session_id (optional)
 */
export const usePermissions = (sessionId?: string) => {
  const localSessionId = useLocalSessionId();
  const permissions = useParticipantProperty(
    sessionId ?? localSessionId,
    'permissions'
  );

  const canSendAudio =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('audio');
  const canSendVideo =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('video');
  const canSendCustomAudio =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('customAudio');
  const canSendCustomVideo =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('customVideo');
  const canSendScreenAudio =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('screenAudio');
  const canSendScreenVideo =
    typeof permissions?.canSend === 'boolean'
      ? permissions?.canSend
      : permissions?.canSend.has('screenVideo');
  const canAdminParticipants =
    typeof permissions?.canAdmin === 'boolean'
      ? permissions?.canAdmin
      : permissions?.canAdmin.has('participants');
  const canAdminStreaming =
    typeof permissions?.canAdmin === 'boolean'
      ? permissions?.canAdmin
      : permissions?.canAdmin.has('streaming');
  const canAdminTranscription =
    typeof permissions?.canAdmin === 'boolean'
      ? permissions?.canAdmin
      : permissions?.canAdmin.has('transcription');

  return {
    canAdminParticipants,
    canAdminStreaming,
    canAdminTranscription,
    canSendAudio,
    canSendCustomAudio,
    canSendCustomVideo,
    canSendScreenAudio,
    canSendScreenVideo,
    canSendVideo,
    hasPresence: permissions?.hasPresence,
    permissions,
  };
};
