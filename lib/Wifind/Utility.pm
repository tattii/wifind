package Wifind::Utility;


# URLの短縮
sub shortenURL
{
	my $url = shift;
	my $length = shift || 20;

	if ( $url ){
		$url =~ m#(?:http|https)://(?:www\.)?(.{0,$length})(.*)#;
		if ( $2 ){
			return $1."...";
		}else{
			return $1;
		}
	}
}


# 時間変換
sub timeToString
{
	my $time = shift;

	my ($sec, $min, $hour, $mday, $mon, $year) = localtime($time);
	$mon += 1;
	$year += 1900;
	return "$year/$mon/$mday ".sprintf("%2d:%02d", $hour, $min);
}


1;
