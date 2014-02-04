package Wifind::Model::Tip;

use MongoDB;

my $DB = "test";
my $COLLECTION = "wifind_tip";



sub add
{
	my $param = shift;

	my $coll = MongoDB::MongoClient->new->get_database($DB)->get_collection($COLLECTION);

	my $id = $coll->insert({
		message	=> $param->{message},
		user	=> $param->{user},
		spot_id	=> $param->{spot_id},
		time	=> time(),
	});
	return $id;
}

sub get
{
	my $id = shift;

	my $coll = MongoDB::MongoClient->new->get_database($DB)->get_collection($COLLECTION);

	my $result = $coll->find_one({ _id => $id });
	return $result;
}


sub getSpotTips
{
	my $spot_id = shift;

	my $coll = MongoDB::MongoClient->new->get_database($DB)->get_collection($COLLECTION);

	my $result = $coll->find({ spot_id => $spot_id });

	my @tips;
	while (my $tip = $result->next){
		push @tips, $tip;
	}

	return \@tips;
}


sub getAll
{
	my $coll = MongoDB::MongoClient->new->get_database($DB)->get_collection($COLLECTION);

	my $result = $coll->find();

	my @tips;
	while (my $tip = $result->next){
		push @tips, $tip;
	}

	return \@tips;
}



1;
