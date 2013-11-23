package Wifind::Model::Spot;

use strict;
use warnings;
use utf8;

use Data::Dumper;
use MongoDB;


my $DB = "test";
my $COLLECTION = "wifind03";



sub getSpotData
{
	my $id = shift;

	my $coll = MongoDB::MongoClient->new->get_database($DB)->get_collection($COLLECTION);
	my $result = $coll->find_one({ _id => $id });

	return $result;
}





1;

