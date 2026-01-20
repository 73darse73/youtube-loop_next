import type { Video } from '../../api/types';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

export const VideoCard = ({ video, onPlay }: VideoCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">
            動画ID: {video.videoId}
          </div>
          <div className="text-sm text-gray-500">
            開始: {video.startTime}秒 / 終了: {video.endTime}秒
          </div>
          <div className="text-xs text-gray-400">
            保存日時: {new Date(video.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPlay(video)}
            className="px-3 py-1 text-sm bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
          >
            再生
          </button>
        </div>
      </div>
    </div>
  );
}; 