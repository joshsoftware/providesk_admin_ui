require 'mina/rails'
require 'mina/git'

set :application_name, 'providesk_admin_ui'
set :domain, 'pg-stage-intranet.joshsoftware.com'
set :deploy_to, '/www/providesk_admin_ui'
set :repository, 'git@github.com:joshsoftware/providesk_admin_ui.git'
set :branch, 'vite'
set :user, 'ubuntu'
set :forward_agent, true

set :shared_dirs, fetch(:shared_dirs, []).push('node_modules')
set :shared_files, fetch(:shared_files, []).push('.env')

task :setup do 
end

task :remote_environment do
  # For those using RVM, use this to load an RVM version@gemset.
  command %{source ~/.nvm/nvm.sh}
end

task :deploy do
  deploy do
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'

    comment "Installing dependencies"
    command %{npm install --legacy-peer-deps}

    comment "Build react app"
    command %{npm run build}
  end 
end



# # require 'mina/rails'
# require 'mina/git'
# # require 'mina/version_managers/rvm'
# # require "mina_sidekiq/tasks"

# set :rails_env, 'staging'
# set :application_name, 'providesk_admin_ui'
# set :domain, 'pg-stage-intranet.joshsoftware.com'
# set :deploy_to, '/www/providesk_admin_ui'
# set :repository, 'git@github.com:joshsoftware/providesk_admin_ui.git'
# set :branch, 'master'
# set :user, 'ubuntu'
# set :forward_agent, true
# # set :rvm_use_path, '/usr/local/rvm/scripts/rvm'

# set :shared_files, ['.env']

# task :remote_environment do
#   # For those using RVM, use this to load an RVM version@gemset.
#   command %{source ~/.nvm/nvm.sh}
# end

# # Put any custom mkdir's in here for when `mina setup` is ran.
# # For Rails apps, we'll make some of the shared paths that are shared between
# # all releases.
# task :setup => :remote_environment do

# end

# desc "Deploys the current version to the server."
# task :deploy => :remote_environment do
#   deploy do
#     # Put things that will set up an empty directory into a fully set-up
#     # instance of your project.
#     invoke :'git:clone'
#     invoke :'deploy:link_shared_paths'
#     command %{npm install}
#     command %{npm run build}
#     command %{rm -rf node_modules/}
#     command %{ls}
#     # invoke :'deploy:cleanup'

#     on :launch do
#       in_path(fetch(:current_path)) do
#       end
#       # invoke 'application:restart'
#     end
#   end
# end
