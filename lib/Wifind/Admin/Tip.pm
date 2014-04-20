package Wifind::Admin::Tip;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Tip;

sub show
{
	my $self = shift;
	return unless $self->digest_auth;

	my $all = Wifind::Model::Tip::getAll();
	$self->stash( tips => $all );
	$self->render('admin/tip');
}

1;
