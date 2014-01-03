use strict;
use warnings;
use utf8;

use Data::Dumper;

use Tip;


print Wifind::Model::Tip::add({
	message => "すごい！",
	user => "tattii",
	spot_id => "c20ac305e5c7ac02",
});


print Dumper Wifind::Model::Tip::getSpotTips("c20ac305e5c7ac02");
