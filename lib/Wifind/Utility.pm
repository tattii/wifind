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


1;
