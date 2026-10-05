Part2_mix_916.wav (2026-10-05): the shipped master overshot to +0.2 dBTP after AAC 320k encoding (ultrasonic
content around the end-card hit, 44-46 s). Fixed by a 17 kHz low-pass on the master
(ffmpeg -af lowpass=f=17000, 24-bit): AAC-decoded true peak -2.1 dBTP, integrated -14.1 LUFS.
Re-running master.py 916 instead lands at -16.9 LUFS, so the existing master was kept and only low-passed.
