package  
{
	import flash.display.MovieClip;  
    import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.media.SoundTransform;
	import flash.events.Event;
	import flash.system.Security;
	
    public class SoundManager extends MovieClip  
    {  
		Security.allowDomain("*");
		
		public static const MAX_VOLUME:Number = 1.0;

		private var _volume:Number = MAX_VOLUME;
		private var _muted:Boolean = false;
		private var _sound:SoundData;
		
		private var _soundTransform:SoundTransform = new SoundTransform();
		
        public function SoundManager()  
        {
			
			if (flash.external.ExternalInterface.available) {
    			flash.external.ExternalInterface.addCallback("audioplay", externalPlay);
				//ExternalInterface.addCallback("audiopause", externalPause);
				flash.external.ExternalInterface.addCallback("audiostop", externalStop);
				flash.external.ExternalInterface.addCallback("audioVol", changeVol);
				flash.external.ExternalInterface.addCallback("audioMute", getMute);
			}
			
			//to be deleted when implementing volumes/mute
			playSound(Bg);
        }
		
		public function playSound(soundClass:Class):void
		{
			if (_muted)
				return;

			var sound:Sound = new soundClass();
			_soundTransform = new SoundTransform(_volume);
			var channel:SoundChannel = sound.play(0, 0, _soundTransform);
			channel.addEventListener(Event.SOUND_COMPLETE, onSoundComplete);

			_sound = new SoundData(soundClass, channel);
		}

		private function onSoundComplete(e:Event):void
		{
			var channel:SoundChannel = SoundChannel(e.target);
			//_sounds.splice(_sounds.indexOf(findSoundByChannel(channel)), 1);
		}

		public function stopSound(myClass:Class):void
		{
			var soundData:SoundData = findSoundByClass(myClass);

			if (soundData)
				soundData.channel.stop();
		}
		
		private function findSoundByClass(soundClass:Class):SoundData
		{
			
			if (_sound.soundClass == soundClass)
				return _sound;
		

			return null;
		}
		
		private function stopAllSounds():void
		{
			_sound.channel.stop();
		}
		
		public function get volume():Number { return _volume; }

		public function set volume(value:Number):void
		{
			_volume = value;
			_soundTransform.volume = _volume;
		}

		public function get muted():Boolean { return _muted; }

		public function set muted(value:Boolean):void
		{
			if (_muted != value)
			{
				_muted = value;
				if (_muted)
					stopAllSounds();
			}
		}

		
        public function externalPlay():void {  
			playSound(Bg);
        }
		
        public function externalStop():void {  
			stopSound(Bg);
        }
		
        public function changeVol(vol:Number):void {  
			volume = vol;
        }  
		
        public function getMute(isMute:Boolean):void {  
			muted = isMute;
        }  
    }  
}


import flash.media.SoundChannel;
import flash.utils.getTimer;

internal class SoundData
{
	public var channel:SoundChannel;
	public var soundClass:Class;
	public var startTime:uint = getTimer();

	public function SoundData(soundClass:Class, channel:SoundChannel)
	{
		this.channel = channel;
		this.soundClass = soundClass;
		this.startTime = startTime;
	}

	public function get interval():uint
	{
		return getTimer() - startTime;
	}
}