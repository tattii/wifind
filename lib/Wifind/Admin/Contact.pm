package Wifind::Admin::Contact;

use Mojo::Base 'Mojolicious::Controller';

use Wifind::Model::Contact;

sub show
{
	my $self = shift;
	return unless $self->digest_auth;

	my $all = Wifind::Model::Contact::getAll();
	$self->stash( contacts => $all );
	$self->render('admin/contact');
}

1;
